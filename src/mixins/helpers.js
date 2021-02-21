import moment from "moment";

export default {
  data() {
    return {
      daysBack: 14,
      today: "YYYY-MM-DD",
      // visitFormat: "HH:mm:ss:SSS on ddd, MMM DD",
      visitFormat: "HH:mm ddd, MMM DD",
      defaultQuery: {
        visitor: "",
        id: "",
        nsp: "",
      },
    };
  },
  methods: {
    printJson: function(json, spacer = 3) {
      const replacer = null;
      return JSON.stringify(json, replacer, spacer);
    },

    parseParams(querystring) {
      // parse query string
      const params = new URLSearchParams(querystring);

      const obj = {};

      // iterate over all keys
      for (const key of params.keys()) {
        if (params.getAll(key).length > 1) {
          obj[key] = params.getAll(key);
        } else {
          obj[key] = params.get(key);
        }
      }

      return obj;
    },

    getQuery() {
      let query = this.$socket.io.opts.query || this.defaultQuery;
      return query;
    },

    printQuery() {
      const query = this.getQuery();
      if (!query.id) {
        return "Empty query";
      }
      return this.printJson(query);
    },

    //#region set operations
    intersection(setA, setB) {
      let _intersection = new Set();
      for (let elem of setB) {
        if (setA.has(elem)) {
          _intersection.add(elem);
        }
      }
      return _intersection;
    },

    difference(setA, setB) {
      let _difference = new Set(setA);
      for (let elem of setB) {
        _difference.delete(elem);
      }
      return _difference;
    },
    //#endregion

    //#region moment-based code
    getNow() {
      // const shortDateTimeFormat = 'lll';
      const timeFormat = "HH:mm:ss:SSS";
      return moment().format(timeFormat);
    },

    isToday(date, daysBack) {
      let x = moment(date).format(this.today);
      let y = moment()
        .add(-daysBack, "day")
        .format(this.today);
      return x == y;
    },

    isBetween(date, daysBack) {
      let visit = moment(date);

      let past = moment()
        .add(-daysBack, "day")
        .format("YYYY-MM-DD");
      let tomorrow = moment()
        .add(1, "day")
        .format("YYYY-MM-DD");
      let test = visit.isBetween(past, tomorrow);
      return test;
    },

    formatVisitedDate(date) {
      let x = moment(new Date(date)).format(this.visitFormat);
      return x;
    },

    groupBy(payload) {
      const { array, prop, val } = payload;

      return array
        .filter((v) => v[val]) // ignore Room Opened/Closed messages
        .reduce(function(a, c) {
          let key = moment(c[prop]).format("YYYY-MM-DD");
          if (!a[key]) {
            a[key] = [];
          }
          a[key].push(c[val]);
          return a;
        }, {});
    },
    //#endregion
  },
};
