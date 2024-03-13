import deleteRecord from '~/lib/deleteRecord';
import insertRecord from '~/lib/insertRecord';
import selectRecord from '~/lib/selectRecord';
import updateRecord from '~/lib/updateRecord';

function getLength(section) {
  const [l, r] = section;
  return r - l + 1;
}

function pairEqual(c1, c2) {
  let flag = true;
  for (let i = 0; i < c1.length; i += 1) {
    if (c1[i] !== c2[i]) {
      flag = false;
    }
  }
  return flag;
}

function deepCopyRecord(l, r, o, ans, datas, filters) {
  for (let i = l; i <= r; i += 1) {
    if (ans[i - o] === undefined) {
      ans[i - o] = {};
    }
    filters.forEach((f) => {
      ans[i - o][f] = datas[i][f];
    });
  }
}

function generateBareJump(sections, i, jumps) {
  const section = sections[i - 1];
  if (section !== undefined) {
    const [l1, r1] = section;
    const [l2] = sections[i];
    jumps[r1 + 1] = [l2 - 1, i - 1];
  }
}

function concatSections(sections) {
  if (sections.length === 1) {
    return sections;
  }
  let i = 0;
  while (sections[i + 1] !== undefined) {
    const [l1, r1] = sections[i];
    const [l2, r2] = sections[i + 1];
    if (r1 >= l2 - 1) {
      const min = Math.min(l1, l2);
      const max = Math.max(r1, r2);
      sections.splice(i, 2, [min, max]);
    } else {
      i += 1;
    }
  }
  return sections;
}

function radixSort(list) {
  list = list.map((e) => [e[0], e]);
  const bucket = new Array(10);
  while (true) {
    for (let i = 0; i < bucket.length; i += 1) {
      bucket[i] = undefined;
    }
    let flag = 0;
    list.forEach((e, i) => {
      const [s] = e;
      const m = s % 10;
      if (bucket[m] === undefined) {
        bucket[m] = [];
      }
      bucket[m].unshift(i);
      const r = parseInt(s / 10);
      if (r !== 0) {
        flag += 1;
      }
      list[i][0] = r;
    });
    if (flag === 0) {
      break;
    }
    const newList = [];
    for (let i = 0; i < bucket.length; i += 1) {
      const groove = bucket[9 - i];
      if (Array.isArray(groove)) {
        groove.forEach((e) => {
          newList.unshift(list[e]);
        });
      }
    }
    list = newList;
  }
  const ans = [];
  for (let i = 0; i < bucket.length; i += 1) {
    const groove = bucket[9 - i];
    if (Array.isArray(groove)) {
      groove.forEach((e) => {
        ans.unshift(list[e][1]);
      });
    }
  }
  return ans;
}

class Table {
  constructor(tb, options) {
    this.tb = tb;
    this.hash = {};
    this.datas = [];
    this.average = {
      bare: 0,
      occupy: 0,
    };
    this.options = options;
    const {
      options: {
        recordUseCount,
      },
    } = this;
    if (recordUseCount === true) {
      this.counts = [];
      this.outOfOrder = true;
    }
  }

  emptyCache() {
    this.hash = {};
    this.datas = [];
    const {
      options: {
        recordUseCount,
      },
    } = this;
    if (recordUseCount === true) {
      this.counts = [];
      this.outOfOrder = true;
    }
  }

  reduceRecordsCache(count) {
    const { outOfOrder, } = this;
    if (outOfOrder === true) {
      const { counts, } = this;
      this.orders = counts.map((e, i) => [e, i]);
      this.orders = radixSort(this.orders);
      const { orders, } = this;
      for (let i = 0; i < count; i += 1) {
        const [_, x] = orders[i];
        this.deleteDataById(x);
      }
      this.outOfOrder = false;
    }
  }

  arrangePointers() {
    const { hash, } = this;
    const keys = Object.keys(hash);
    keys.forEach((k) => {
      this.concatSections(k);
    });
    let indexs = new Array(keys.length);
    for (let i = 0; i < indexs.length; i += 1) {
      indexs[i] = i;
    }
    const sets = [];
    while (indexs.length !== 0) {
      const set = [];
      const source = hash[keys[indexs[0]]].sections;
      if (source !== undefined) {
        set.push(indexs[0]);
      }
      for (let i = 1; i < indexs.length; i += 1) {
        const target = hash[keys[indexs[i]]].sections;
        if (source === undefined) {
          if (source === target) {
            indexs.splice(i, 1);
          }
        }
        if (Array.isArray(source) && Array.isArray(target)) {
          if (source.length !== target.length) {
            continue;
          } else {
            let flag = true;
            for (let i = 0; i < source.length; i += 1) {
              if (!pairEqual(source[i], target[i])) {
                flag = false;
                break;
              }
            }
            if (flag === true) {
              set.push(indexs[i]);
              indexs.splice(i, 1);
            }
          }
        }
      }
      indexs.shift();
      if (source !== undefined) {
        sets.push(set);
      }
    }
    sets.forEach((set) => {
      let source;
      const pointers = [];
      set.forEach((x) => {
        const k = keys[x];
        const e = hash[k];
        if (e.type === 's' && source === undefined) {
          source = k;
        } else {
          pointers.push(k);
        }
      });
      pointers.forEach((k) => {
        hash[k] = {
          type: 'p',
          pointer: source,
        };
      });
    });
  }

  countSection(section) {
    const [l, r] = section;
    const { counts, } = this;
    for (let i = l; i <= r; i += 1) {
      if (counts[i] === undefined) {
        counts[i] = 0;
      }
      counts[i] += 1;
      this.outOfOrder = true;
    }
  }

  updateAverageLast(section, sections) {
    const { length, } = sections;
    const s1 = sections[length - 1];
    const s2 = sections[length - 2];
    const v1 = getLength(s1);
    const {
      average: {
        bare,
        occupy,
      },
    } = this;
    this.average.occupy = (v1 + occupy) / 2;
    if (s2 !== undefined) {
      const [l1, r1] = s1;
      const [l2, r2] = s2;
      const v2 = getLength([r1 + 1, l2 - 1]);
      this.average.bare = (v1 + bare) / 2;
    }
  }

  updateAverageMiddle(i, sections) {
    const s1 = sections[i];
    const s2 = sections[i - 1];
    const v1 = getLength(s1);
    const {
      average: {
        bare,
        occupy,
      },
    } = this;
    this.average.occupy = (v1 + occupy) / 2;
    if (s2 !== undefined) {
      const [l1, r1] = s1;
      const [l2, r2] = s2;
      const v2 = getLength([r1 + 1, l2 - 1]);
      this.average.bare = (v1 + bare) / 2;
    }
  }

  shadowCopyRecord(l, r, o, ans, datas) {
    const {
      options: {
        spaceOptimize,
      },
    } = this;
    if (spaceOptimize === true) {
      deepCopyRecord(l, r, o, ans, datas, filters);
    } else {
      for (let i = l; i <= r; i += 1) {
        ans[i - o] = datas[i];
      }
    }
  }

  async cacheSections(sections, datas, filter) {
    const {
      options: {
        type,
        connection,
      },
      tb,
    } = this;
    for (let i = 0; i < sections.length; i += 1) {
      const s = sections[i];
      const records = await selectRecord(type, connection, tb, s, [filter]);
      const [l, r] = s;
      if (records.length > 0) {
        for (let i = 0; i <= r - l; i += 1) {
          if (datas[l + i] === undefined) {
            datas[l + i] = {};
          }
          datas[l + i][filter] = records[i][filter];
        }
      }
    }
  }

  concatSections(filter) {
    let { sections, jumps, } = this.hash[filter];
    if (sections.length === 0) {
      return;
    }
    const { chaotic, } = this.hash[filter];
    if (chaotic === true) {
      this.hash[filter].sections = radixSort(sections);
      sections = this.hash[filter].sections;
      let i = 0;
      while (sections[i + 1] !== undefined) {
        const {
          average: {
            bare,
            occupy,
          },
        } = this;
        const [l1, r1] = section[i];
        const [l2, r2] = section[i + 1];
        const v1 = getLength(section[i]);
        this.average.occupy = (v1 + occupy) / 2;
        const v2 = getLength(section[i + 1]);
        this.average.occupy = (v2 + occupy) / 2;
        const v3 = getLength([r1 + 1, l2 - 1]);
        this.average.bare = (v3 + occupy) / 2;
        if (r1 >= l2 - 1) {
          const min = Math.min(l1, l2);
          const max = Math.max(r1, r2);
          sections.splice(i, 2, [min, max]);
          jumps[min] = [max, i];
          generateBareJump(sections, i, jumps);
        } else {
          i += 1;
          generateBareJump(sections, i, jumps);
        }
      }
      this.hash[filter].chaotic = false;
    }
  }

  arrangeRecords(datas, section, filters) {
    const h = {};
    const ans = [];
    filters.forEach((f) => {
      h[f] = true;
    });
    const min = {};
    const { hash, } = this;
    Object.keys(hash).forEach((k) => {
      if (h[k] === undefined) {
        const groove = hash[k];
        if (groove.type === 's') {
          min[k] = true;
        } else {
          min[groove.pointer] = true;
        }
      }
    });
    let intersections = [];
    const [l1, r1] = section;
    Object.keys(min).forEach((k) => {
      this.concatSections(k);
      const { sections, } = hash[k];
      sections.forEach((s) => {
        const [l2, r2] = s;
        if (!(r2 < l1 || l2 > r1)) {
          const min = Math.min(r1, r2);
          const max = Math.max(l1, l2);
          intersections.push([max, min]);
        }
      });
    });
    if (intersections.length === 0) {
      this.shadowCopyRecord(l1, r1, l1, ans, datas);
      return ans;
    }
    intersections = radixSort(intersections);
    intersections = concatSections(intersections);
    if (intersections.length === 1) {
      const [l3, r3]= intersections[0];
      if (l3 > l1) {
        this.shadowCopyRecord(l1, l3 - 1, l1, ans, datas);
      }
      deepCopyRecord(l3, r3, l1, ans, datas, filters);
      if (r3 < r1) {
        this.shadowCopyRecord(r3 + 1, r1, l1, ans, datas);
      }
    } else {
      const left = intersections[0][0];
      if (left > l1) {
        this.shadowCopyRecord(left, l1 - 1, l1, ans, datas);
      }
      for (let i = 0; i < intersections.length - 1; i += 1) {
        const [l3, r3] = intersections[i];
        const [l4, r4] = intersections[i + 1];
        deepCopyRecord(l3, r3, l1, ans, datas, filters);
        deepCopyRecord(l4, r4, l1, ans, datas, filters);
        this.shadowCopyRecord(r3 + 1, l4 - 1, l1, ans, datas);
      }
      const right = intersections[intersections.length - 1][1];
      if (right < l1) {
        deepCopyRecord(right + 1, l1, l1, ans, datas, filters);
      }
    }
    return ans;
  }

  async insert(cnt) {
    const {
      options: {
        type,
        connection,
      },
      tb,
    } = this;
    if (Array.isArray(cnt)) {
      await insertRecord(type, connection, tb, cnt);
    } else {
      await insertRecord(type, connection, tb, [cnt])
    }
  }

  async deleteExchange(id, total) {
    const {
      options: {
        type,
        connection,
      },
    } = this;
    if (id === total - 1) {
      const { tb, } = this;
      await deleteRecord(type, connection, tb, id);
      this.deleteDataById(id);
    } else {
      const { tb, } = this;
      const records = await selectRecord(type, connection, tb, [total - 1, total - 1]);
      const record = records[0];
      await deleteRecord(type, connection, tb, total - 1);
      record.id = id;
      await updateRecord(type, connection, tb, record);
      this.deleteDataById(total - 1);
    }
  }

  deleteDataById(id) {
    const { hash, datas, } = this;
    if (datas[id] !== undefined) {
      Object.keys(datas[id]).forEach((k) => {
        if (hash[k].type === 's') {
          const { sections, jumps, } = hash[k];
          sections.forEach((s, i) => {
            const [l, r] = s;
            if (id === l) {
              sections[i] = [l + 1, r];
            }
            if (id === r) {
              sections[i] = [l, r - 1];
            }
            if (id > l && id < r) {
              sections.splice(i, 1, [l, id - 1], [id + 1, r]);
              jumps[l] = [id - 1, i];
              jumps[id + 1] = [r, i + 1];
            }
          });
        }
      });
      datas[id] = undefined;
      const {
        options: {
          recordUseCount,
        },
      } = this;
      if (recordUseCount === true) {
        const { counts, } = this;
        counts[id] = 0;
      }
    }
  }

  async delete(id) {
    const {
      options: {
        type,
        connection,
      },
      tb,
    } = this;
    await deleteRecord(type, connection, tb, id);
    this.deleteDataById(id);
  }

  async update(obj) {
    const {
      options: {
        type,
        connection,
      },
      tb,
    } = this;
    await updateRecord(type, connection, tb, obj);
    this.deleteDataById(obj.id);
  }

  async select(section, filters, arrange) {
    const {
      options: {
        type,
        connection,
      },
      datas, tb,
    } = this;
    let records;
    if (filters === undefined) {
      if (this.columns === undefined) {
        const index = section[0];
        records = await selectRecord(type, connection, tb, [index, index]);
        const record = records[0];
        this.columns = [];
        Object.keys(record).forEach((k, i) => {
          this.columns[i] = k;
        });
        const [l] = section;
        this.datas[l] = record;
        const { hash, } = this;
        let first;
        Object.keys(record).forEach((k, i) => {
          const o = hash[k];
          if (o !== undefined && o.type === 's') {
            const { sections, } = o;
            sections.push(section);
            this.updateAverageLast(section, sections);
            o.chaotic = true;
          } else {
            if (i === 0) {
              hash[k] = {
                type: 's',
                sections: [section],
                jumps: [],
                chaotic: false,
              };
              const { jumps, } = hash[k];
              jumps[l] = [l, 1];
              first = k;
            } else {
              hash[k] = {
                type: 'p',
                pointer: first,
              };
            }
          }
        });
      }
      filters = this.columns;
    }
    const set = {};
    const source = {};
    filters.forEach((f, i) => {
      const { hash, } = this;
      const groove = hash[f];
      if (groove === undefined) {
        if (set['*null'] === undefined) {
          set['*null'] = [];
        }
        set['*null'].push(f);
      } else if (groove.type === 'p') {
        const pointer = groove.pointer;
        if (set[pointer] === undefined) {
          set[pointer] = [];
        }
        set[pointer].push(f);
      } else {
        if (set['*rest'] === undefined) {
          set['*rest'] = [];
        }
        set['*rest'].push(f);
      }
      const obj = groove;
      if (obj && obj.type === 's') {
        source[f] = true;
      }
    });
    const keys = Object.keys(set);
    const { hash, } = this;
    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      const s = set[k];
      if (k === '*null') {
        const i = s[0];
        hash[i] = {
          type: 's',
          jumps: [],
          sections: [],
          chaotic: false,
        };
        for (let j = 1; j < s.length; j += 1) {
          hash[s[j]] = {
            type: 'p',
            pointer: i,
          };
        }
        const sections = this.calcSections(section, datas, set[k][0]);
        for (let j = 0; j < s.length; j += 1) {
          const f = s[j];
          await this.cacheSections(sections, datas, f);
        }
      } else if (k === '*rest') {
        const elem = set[k];
        const h = {};
        elem.forEach((e) => {
          h[e] = true;
        });
        const lists = {};
        const { hash, } = this;
        Object.keys(hash).forEach((e) => {
          const o = hash[e];
          const { pointer: p, } = o;
          if (o.type === 'p' && h[p] === true) {
            if (lists[p] === undefined) {
              lists[p] = [];
            }
            lists[p].push(e);
          }
        });
        for (let j = 0; j < elem.length; j += 1) {
          const f = elem[j];
          if (set[f] === undefined) {
            const list = lists[f];
            if (Array.isArray(list)) {
              const { hash, } = this;
              const { sections: s, jumps: j, chaotic, } = hash[f];
              hash[list[0]] = {
                type: 's',
                jumps: j.slice(0, j.length),
                sections: s.slice(0, s.length),
                chaotic,
              };
              for (let i = 1; i < list.length; i += 1) {
                hash[list[i]] = {
                  type: 'p',
                  pointer: list[0],
                };
              }
            }
            const sections = this.calcSections(section, datas, f);
            await this.cacheSections(sections, datas, f);
          }
        }
      } else {
        const elem = set[k];
        const i = s[0];
        if (k !== '*rest' && source[hash[i].pointer] === undefined) {
          const p = hash[i].pointer;
          const { sections: s, jumps: j, chaotic, } = this.hash[p];
          hash[i] = {
            type: 's',
            jumps: j.slice(0, j.length),
            sections: s.slice(0, s.length),
            chaotic,
          };
          for (let j = 1; j < elem.length; j += 1) {
            hash[elem[j]] = {
              type: 'p',
              pointer: i,
            };
          }
          const sections = this.calcSections(section, datas, i);
          await this.cacheSections(sections, datas, i);
          for (let j =0; j < elem.length; j += 1) {
            const f = elem[j];
            await this.cacheSections(sections, datas, f);
          }
        } else {
          if (k !== '*rest') {
            const s = this.hash[i].pointer;
            const sections = this.calcSections(section, datas, s);
            await this.cacheSections(sections, datas, s);
            for (let j = 0; j < elem.length; j += 1) {
              const f = set[k][j];
              await this.cacheSections(sections, datas, f);
            }
          }
        }
      }
      if (arrange === true && filters !== undefined) {
        records = this.arrangeRecords(datas, section, filters);
      } else {
        const {
          options: {
            spaceOptimize,
          },
        } = this;
        if (spaceOptimize === true) {
          deepCopyRecord(l, r, l, records, datas, filters);
        } else {
          records = datas.slice(section[0], section[1] + 1)
        }
      }
      const {
        options: {
          recordUseCount,
        },
      } = this;
      if (recordUseCount === true) {
        this.countSection(section);
      }
    }
    return records;
  }

  calcSections(section, datas, filter) {
    let [index, right] = section;
    const ans = [];
    let pointer = -1;
    this.concatSections(filter);
    let data = datas[index];
    if (data !== undefined && data[filter] !== undefined) {
      const l = getLength([0, index]);
      const {
        average: {
          occupy,
        },
      } = this;
      const multily = occupy * l;
      if (multily >= 2.8 && l / multily >= 28) {
        const { jumps, } = this.hash[filter];
        while (true) {
          const data = datas[index - 1];
          if (jumps[index] !== undefined && (data === undefined || data[filter] === undefined)) {
            const [j, i] = jumps[index];
            index = j;
            pointer = i;
            break;
          } else {
            index -= 1;
          }
        }
      }
    }
    if (data === undefined || data[filter] === undefined) {
      const i = index;
      const l = getLength([0, index]);
      const {
        average: {
          bare,
        },
      } = this;
      const multily = bare * l;
      if (multily >= 2.8 && l / multily >= 28) {
        const { jumps, } = this.hash[filter];
        while (index >= 0) {
          const d = datas[index - 1];
          const jump = jumps[index];
          if (jump !== undefined && (d !== undefined && d[filter] !== undefined)) {
            const [j, i] = jump;
            pointer = i;
            break;
          } else {
            index -= 1;
          }
        }
        index = i;
      }
    }
    while (index <= right) {
      const data = datas[index];
      if (data === undefined || data[filter] === undefined) {
        let { jumps, sections, } = this.hash[filter];
        if (sections.length === 0) {
          sections.push(section);
          this.updateAverageLast(section, sections);
          ans.push(section);
          const [l, r] = section;
          jumps[l] = [r, 0];
          return ans;
        }
        this.concatSections(filter);
        const d = datas[index - 1];
        const jump = jumps[index];
        if (jump !== undefined && (d && d[filter] !== undefined)) {
          const [j, p] = jump;
          index = j + 1;
          pointer = p;
        }
        for (let i = pointer; i <= sections.length; i += 1) {
          const s = sections[i + 1];
          if (i <= -1 && sections[i] === undefined) {
            if (s !== undefined) {
              const [l, r] = s;
              if (index < r) {
                pointer = 0;
                const section = [index, r];
                ans.push(section);
                sections.splice(1, 0, section);
                this.updateAverageMiddle(1, sections);
                jumps[index] = [r, 0];
                index = r + 1;
                break;
              }
            }
            continue;
          }
          if (i >= sections.length - 1 && s === undefined) {
            const section = sections[i];
            if (section === undefined || index > section[1]) {
              pointer = sections.length - 1;
              const section = [index, right];
              ans.push(section);
              sections.push(section);
              this.updateAverageLast(section, sections);
              return ans;
            }
            return ans;
          }
          const [l1, r1] = sections[i];
          const [l2, r2] = s;
          if (index > r1 && index < l2) {
            pointer = i + 1;
            const section = [index, l2];
            if (l2 <= right) {
              index = l2;
            }
            ans.push(section);
            sections.splice(i + 1, 0, section);
            this.updateAverageMiddle(i + 1, sections);
            jumps[r1 + 1] = [l2 - 1, i];
            break;
          }
        }
      } else {
        const { jumps, sections, } = this.hash[filter];
        const data = datas[index - 1];
        if (jumps[index] !== undefined && (data === undefined || data[filter] === undefined)) {
          const [j, p] = jumps[index];
          index = j + 1;
          pointer = p;
        } else {
          this.concatSections(filter);
          const sections = this.hash[filter].sections;
          for (let i = pointer; i < sections.length; i += 1) {
            if (sections[i] !== undefined) {
              const [l, r] = sections[i];
              if (index >= l && index <= r) {
                pointer = i;
                index = r + 1;
                break;
              }
            }
          }
        }
      }
    }
    return ans;
  }
}

export default Table;
