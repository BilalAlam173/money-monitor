const TRANSACTION_TYPES = [""];

const result = {};

function uploadDealcsv() {}

/*------ Method for read uploded csv file ------*/
uploadDealcsv.prototype.getCsv = function (e) {
  let input = document.getElementById("file");
  input.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      var myFile = this.files[0];
      var reader = new FileReader();

      reader.addEventListener("load", function (e) {
        let csvdata = e.target.result;
        parseCsv.getParsecsvdata(csvdata); // calling function for parse csv data
      });

      reader.readAsBinaryString(myFile);
    }
  });
};

/*------- Method for parse csv data and display --------------*/
uploadDealcsv.prototype.getParsecsvdata = function (data) {
  let parsedata = [];

  let newLinebrk = data.split("\n");
  for (let i = 0; i < newLinebrk.length; i++) {
    const row = newLinebrk[i].split('"').filter((x) => x !== ",");
    row.pop();
    parsedata.push(row);
  }
  let rowdata = parsedata.slice(11, parsedata.length);
  let cleanedData = rowdata.map((x) => {
    if (!x[0]) return;
    let date = parseDate(x[0]);
    let credit = Number(x[3].replaceAll(",", ""));
    let debit = Number(x[4].replaceAll(",", ""));
    const row = {
      date,
      credit: x[3],
      debit: x[4],
      closingBalance: x[5],
    };

    if (credit && date.date() > 28) {
      date.add(1, "month");
    }
    const key = "" + date.format("MMMM") + "/" + date.year();
    let entry = result[key];
    if (entry) {
      if (credit) entry.credit += credit;
      if (debit) entry.debit += debit;
      entry.saving = entry.credit - entry.debit;
      entry.rows.push(row);
    } else {
      result[key] = {
        credit,
        debit,
        saving: credit - debit,
        rows: [row],
      };
    }
    return row;
  });

  for (let key in result) {
    result[key].credit = result[key].credit.toLocaleString() + " PKR";
    result[key].debit = result[key].debit.toLocaleString() + " PKR";
    result[key].saving = result[key].saving.toLocaleString() + " PKR";
  }
  console.table(result);
  console.log(result);
  //   console.table(cleanedData);
};

var parseCsv = new uploadDealcsv();
parseCsv.getCsv();

function parseDate(dateString) {
  if (!dateString) return;
  dateString = dateString.replaceAll("\t", "");
  return moment(dateString, "DD/MM/YYYY");
}
