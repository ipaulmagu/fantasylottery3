const fs = require("fs");

const CONSTs = {
  cHour: 60 * 60 * 1000,
  cDay: 24 * this.cHour
};

class LocalStore {
  constructor(app, db) {
    this.app = app;
    this.app.localstore = this;
    this.store = db || localStorage;
  }
  getItem(key, defVal) {
    let ret = defVal || null;
    if (this.store) {
      let o = this.store.getItem(key);
      if (o) ret = o;
    }
    return ret;
  }
  setItem(key, v) {
    if (this.store) return this.store.setItem(key, v);
    return null;
  }
  removeItem(key) {
    if (this.store) return this.store.removeItem(key);
    return null;
  }
  clear() {
    if (this.store) this.store.clear;
  }
}

var app = {
  mgrDB: new DBMgr(app),
  game: {},
  localstore: new LocalStore(app, db),

  db: { data, prob },
  data: {}
};

class DBMgr {
  constructor(app) {
    this.app = app;
    this.app.mgrDB = this;
  }

  // getDB(game, cb) {
  //   let g = game || this.app.game;
  // }
  // getRangeOfYears(data, saveDates = false) {
  //   let yStart = new Date(data[0][0]).getFullYear(),
  //     yLast = new Date(data[data.length - 1][0]).getFullYear();
  //   if (yStart > yLast) [yLast, yStart] = [yStart, yLast];
  //   if (saveDates) {
  //     app.db.yearFirst = yStart;
  //     app.db.yearLast = yLast;
  //   }
  //   return [yStart, yLast];
  // }
  // _initNewData_(data, cb) {
  //   app.db.data = data;
  //   this.getRangeOfYears(data, true);
  //   new IterLotto(this.app.db);
  //   this.app.db.prob = new Prob(this.app.db).init();
  //   if (cb) setTimeout(cb, 200);
  //   return true;
  // }
  retrieveFromStorage_(game, cb) {
    // retrieve data from storage if available and fresh
    let gameDataStoredObj = JSON.parse(this.app.localstore.getItem(game.id));
    if (gameDataStoredObj && gameDataStoredObj["data"] && gameDataStoredObj.data.length > 0) {
      let dtDif = new Date() - gameDataStoredObj.dt;
      if (dtDif / CONSTs.cHour < 2) return app.mgrDB._initNewData_(gameDataStoredObj.data, cb);
    }
    return false;
  }

  downloadLottoData(game, cb) {
    // let game = this.app.game;
    // if (this.retrieveFromStorage_(game, cb)) return;

    // waitingDialog.show("Loading " /*+ game.id */ + " ...", {
    //   dialogSize: "sm",
    //   progressType: "warning"
    // });
    // setTimeout(() => {
    //   waitingDialog.hide();
    // }, 5000);
    let sURL = game.url;
    // sURL = "/imr/eoddata/lottery/daily3.txt";
    $.ajax({
      url: sURL
    })
      .done(function(data, b, c) {
        if (c.status != 200) {
          //failed
          console.log("'Internet Connection problem, ... or \n   calottery.com' may be down.\nTry again after 30 min.");
          return -1;
        }
        let iStartPos = -1,
          iCntFields = -1;
        let lines = [];
        data.split("\n").forEach((aline, idx) => {
          if (iStartPos < 0) {
            let i = aline.indexOf("-------- ");
            if (i >= 0) {
              iStartPos = i + 11;
              iCntFields = aline.trim().split(/\s+/g).length;
            }
            return;
          }
          aline = aline.trim();
          if (aline.length < 1) return; //skip empty lines
          // if (iStartPos >= 0) {
          // let pre = aline.substr(0, iStartPos).trim();
          // let i = pre.indexOf(" ");
          // if (i < 0) return;
          var fields = aline.split(/\s{2,}/g).filter((v, i) => i > 0); //[date, n, n, n, ...]
          // let nums = aline
          //   .substr(iStartPos)
          //   .trim()
          //   .split(/\s+/);
          // let fields = [];
          // fields[0] = Number.parseInt(Date.parse(fields[0])); // convert date into an int
          fields = fields.map((n, i) => Number.parseInt(i == 0 ? +Date.parse(n) : n));
          // fields.push(Number.parseInt(Date.parse(pre.substr(i).trim())));
          // nums.forEach(n => fields.push(Number.parseInt(n)));
          lines.push(fields);
          // }
        });
        File.savecsv(game.fname, lines);
        // app.localstore.setItem(
        //   game.id,
        //   JSON.stringify({
        //     data: lines,
        //     dt: +new Date()
        //   })
        // );
        // app.mgrDB._initNewData_(lines, cb);
      })
      .fail(function(a, b, c) {
        console.log("*** Error downloadLottoData() failed:: " + a.status + ": " + a.statusText + " (" + this.url + ")");
      })
      .always(function(a, b, c) {
        console.log("download file: always, finished!");
        // waitingDialog.hide();
      });
  }
}

class File {
  static exists(fname) {
    return fs.existsSync(fname);
  }
  static delete(fname) {
    return fs.unlink(fname, err => {
      if (err) throw err;
      console.log(`${fname} was deleted`);
    });
  }

  static readFile(fname) {
    return fs.readFileSync(fname, "utf8");
  }
  static readCSV(fname) {
    return this.readFile(fname)
      .split("\n")
      .map(aline => aline.split(","));
  }

  static write(fname, data) {
    if (!fname || fname.length < 1) return -1;
    if (!data) return -2;
    const _data = new Uint8Array(Buffer.from(data));
    // fs.writeFileSync(fname,_data)
    fs.writeFile(fname, _data, err => {
      if (err) throw err;
      console.log(`${fname} been written!`);
    });
  }
  /**
   *
   * @param {*} fname
   * @param {*} lines | ["f1,f2,f3,...", "f1,f2,f3, ...", ... ]
   * @param {*} lineDel
   */
  static save(fname, lines, lineDel = "\n") {
    if (!fname || fname.length < 1) return -1;
    if (!lines || lines.length < 1) return -2;
    const dataLines = Array.isArray(lines) ? lines.join(lineDel) : lines;
    const data = new Uint8Array(Buffer.from(dataLines));
    // fs.writeFileSync(fname,data)
    fs.writeFile(fname, data, err => {
      if (err) throw err;
      console.log(`${fname} been saved!`);
    });
  }

  static savecsv(fname, lines) {
    return this.write(fname, lines.map(aline => aline.join(",")).join("\n"));
  }
}
