


import { d3 } from './D3.js';

import * as ubdTinyTools from './UBD-TinyTools.js';

'use strict'

export var UBDTabellen = {
        version: '4.3',
        Author: 'Urs Derendinger',
        Datum: '02.05.2017',
        note: "Kompatibel zu d3.v4",
        modules: ["Tabulate", "Tabulate", "HtmlTreeTable", "tabInput_array", "getAllChildren", "simpleHtmlTabelle", "simpleHtmlTableScroll", "Grid"]
    };


  export  function Tabellen() {
        var fDataLoaded = false;
        var a;
        var dataPath;
        var dataPath2;
        var dataPathDetail;
        var columns;
        var columnNames;
        var columnsDetail;
        var columnNamesDetail;
        var mClassDiv = "scroll";
        var mClassHead = "zebra tab";
        var mClassBody = "zebra tab";
        var mClassHeadCol = "zebra col";
        var mClassBodyCol = "zebra col";


        var data;
        var selection;
        var editable = false;
        var fUpdate = function () { };
        

        function tabelle(_selection) {
            if (_selection) selection = _selection;
            //console.log("selection", selection);

            selection.each(function (data) {

                if (!fDataLoaded) {
                    fLoadData();
                    fDataLoaded = true;
                }
            });

            function fLoadData() {
                //console.log("dataPath", dataPath + "/");

                d3.queue().defer(d3.json, dataPath).await(loadData);

                function loadData(error, _data) {
                    data = _data //.sort(function (a, b) { return d3.ascending(a.Mv0076A, b.Mv0076A) })

                    a = Tabulate();
                    //console.log(columns, columnNames);
                    a.columns(columns)
                        .columnNames(columnNames)
                        .mClassHead(mClassHead).mClassDiv(mClassDiv).mClassBody(mClassBody)
                        //.mClass(mClass)
                        .fonClick(
                        function (d) {
                            console.log(d)
                            selection.select(".tCol").html("<h4>" + d[columns[0]] + "</h4>");
                            d3.queue().defer(d3.json, dataPathDetail(d)).await(fCodeDetail);
                            function fCodeDetail(error, data) {
                                selection.select(".col").selectAll("table").remove();
                                selection.select(".col").select("div").remove();
                                var b = Tabulate();
                                b.editable(editable);
                                b.columns(columnsDetail)
                                    .columnNames(columnNamesDetail)
                                    .mClassHead(mClassHeadCol).mClassDiv(mClassDiv).mClassBody(mClassBodyCol)
                                    //.mClass(mClassDetail)
                                    .fonClick(function (d) {
                                        console.log("das ist ein Test", d);
                                        var c = Tabellen();
                                        c.dataPath(dataPath2 + d[columns[0]].toString().trim() + "/");
                                        c.dataPath2(dataPath2 + "/");
                                        c.dataPathDetail(dataPathDetail);
                                        c.columns(columns).columnNames(columnNames);
                                        c.columnsDetail(columnsDetail).columnNamesDetail(columnNamesDetail);
                                        selection.select(".tab").selectAll("table").remove();
                                        selection.select(".tab").select("div").remove();
                                        selection.call(c);
                                    });
                                selection.select(".col").datum(data).call(b);
                            }
                        }

                        );
                    selection.select(".tab").datum(data).call(a);

                }

            }
        }


        tabelle.insert = function (_) {
            if (arguments.length)
                a.insert(_);
        };

        tabelle.dataPath = function (_) {
            if (!arguments.length)
                return dataPath;
            dataPath = _;
            return tabelle;
        };

        tabelle.dataPath2 = function (_) {
            if (!arguments.length)
                return dataPath2;
            dataPath2 = _;
            return tabelle;
        };

        tabelle.dataPathDetail = function (_) {
            if (!arguments.length)
                return dataPathDetail;
            dataPathDetail = _;
            return tabelle;
        };

        tabelle.columns = function (_) {
            if (!arguments.length)
                return columns;
            columns = _;
            return tabelle;
        };

        tabelle.columnNames = function (_) {
            if (!arguments.length)
                return columnNames;
            columnNames = _;
            return tabelle;
        };

        tabelle.columnsDetail = function (_) {
            if (!arguments.length)
                return columnsDetail;
            columnsDetail = _;
            return tabelle;
        };

        tabelle.columnNamesDetail = function (_) {
            if (!arguments.length)
                return columnNamesDetail;
            columnNamesDetail = _;
            return tabelle;
        };

        tabelle.mClassDiv = function (_) {
            if (!arguments.length)
                return mClassDiv;
            mClassDiv = _;
            return tabelle;
        };

        tabelle.mClassBody = function (_) {
            if (!arguments.length)
                return mClassBody;
            mClassBody = _;
            return tabelle;
        };

        tabelle.mClassHead = function (_) {
            if (!arguments.length)
                return mClassHead;
            mClassHead = _;
            return tabelle;
        };

        tabelle.editable = function (_) {
            if (!arguments.length)
                return editable;
            editable = _;
            return tabelle;
        };

        tabelle.fUpdate = function (_) {
            if (!arguments.length)
                return fUpdate;
            fUpdate = _;
            return tabelle;
        };


        return tabelle;
    }



   export function Tabulate() {

        var columns; //= ["c", "n", "d", "f"];
        var columnNames; //= ["cala", "nana", "dada", "fada"];
        var fonClick = function (event, d) { console.log(d); };
        var mClassHead, mClassDiv, mClassBody;
        var level = 1;
        var mformat = true;
        var editable = false;
        var fUpdate = function (d) {
            console.log("update:", d);
        };
        var data;
        var selection;
        var tbody;


        function tabulate(_selection) {
            if (_selection) selection = _selection;
            selection.each(function (_data) {
                if (_data) data = _data;

                table(data);

            });

            return tabulate;
        }


        function table(datax) {

            selection.select("table").remove();
            selection.select("div").remove();
            var tablehead = selection.append("table");
            tablehead.attr("class", mClassHead);

            // append the header row
            tablehead.append("tr")
                .selectAll("th")
                .data(columnNames)
                .enter()
                .append("th")
                    .text(function (column) { return column; });

            var div = selection.append("div");
            div.attr("class", mClassDiv);
            var table = div.append("table");
            table.attr("class", mClassBody),
            tbody = table.append("tbody");

            // create a row for each object in the data
            var tr = tbody.selectAll("tr").data(datax).enter().append("tr");
            tr.on("click", fonClick)
               .attr("data-level", function (d) { return d.level || level; })
               .classed({ 'hasChildren': function (d, i) { if (d.children === true) return true; } })
            ;

            console.log("rows", tr);

            // create a cell in each row for each column
            var cells = tr.selectAll("td").data(function (row) {
                return columns.map(function (column) {
                    return {
                        id: row.guid, dat: row, column: column
                        //,value: row[column]
                        , level: parseInt(row.level) || 1
                    };
                });
            }).enter().append("td");
            cells.attr("style", function (d, i) {
                if (i == 0 && d.level > 1) { return "padding-left:" + (d.level - 1) * 15 + "px;"; }
            })
           .append("span")
           .html(function (d) {
               //console.log("d.dat[d.column]", d.dat[d.column]);
               if (mformat) {
                   return format(d.dat[d.column]);
               } else {
                   return d.dat[d.column].toString().trim();
               }

           });


            // if (editable) cells.call(make_editable, fUpdate);

        }


        function format(str) {
            if (!(str === undefined || isNaN(str) || str == 0)) {
                //console.log(str);
                var vorzeichen = "";
                if (str < 0) {
                    vorzeichen = "-";
                    str = Math.abs(str);
                }
                var amount = new String(str);
                amount = amount.split("").reverse();

                var output = "";
                for (var i = 0; i <= amount.length - 1; i++) {
                    output = amount[i] + output;
                    if ((i + 1) % 3 == 0 && (amount.length - 1) !== i) { //%=Modus
                        output = " " + output;
                    }
                }
                return vorzeichen + output;
            } else {

                if (str == 0) {
                    return '-';
                } else {
                    return str;
                }
            }

        } //End addCommas


        tabulate.columns = function (_) {
            if (!arguments.length)
                return columns;
            columns = _;
            return tabulate;
        };

        tabulate.fonClick = function (_) {
            if (!arguments.length)
                return fonClick;
            fonClick = _;
            return tabulate;
        };

        tabulate.mClassHead = function (_) {
            if (!arguments.length)
                return mClassHead;
            mClassHead = _;
            return tabulate;
        };

        tabulate.mClassDiv = function (_) {
            if (!arguments.length)
                return mClassDiv;
            mClassDiv = _;
            return tabulate;
        };

        tabulate.mClassBody = function (_) {
            if (!arguments.length)
                return mClassBody;
            mClassBody = _;
            return tabulate;
        };

        tabulate.columnNames = function (_) {
            if (!arguments.length)
                return columnNames;
            columnNames = _;
            return tabulate;
        };

        tabulate.mformat = function (_) {
            if (!arguments.length)
                return mformat;
            mformat = _;
            return tabulate;
        };

        tabulate.editable = function (_) {
            if (!arguments.length)
                return editable;
            editable = _;
            return tabulate;
        };

        tabulate.fUpdate = function (_) {
            if (!arguments.length)
                return fUpdate;
            fUpdate = _;
            return tabulate;
        };

        //inserts new record
        tabulate.insert = function (guid) {

            if (guid) {
                //neue Row clonen
                var n = new Object();
                for (var o in data[0]) {
                    n[o] = "";
                }
                n.guid = guid;
                data.push(n)
                var Row = tbody.selectAll("tr")
                    // .data([n])
                     .data(data)
                     .enter()
                     .append("tr");

                var cells = Row.selectAll("td")
                    .data(function (row) {
                        //console.log(row);
                        return columns.map(function (column) {
                            return {
                                id: row.guid, dat: row, column: column
                                , level: parseInt(row.level) || 1
                            };
                        });
                    })
                    .enter()
                    .append("td")
                    .attr("style", function (d, i) {
                        if (i == 0 && d.level > 1) { return "padding-left:" + (d.level - 1) * 15 + "px;"; }
                    })
                    .append("span")
                    .html(function (d) {
                        //console.log(d);
                        if (mformat) {
                            return format(d.dat[d.column]);
                        } else {
                            return d.dat[d.column].toString().trim();
                        }
                    });

                if (editable) cells.call(make_editable, fUpdate);

            } else {
                console.log("missing guid");
            }

        };


        tabulate.delete = function () {

            if (columns[0] == "inp") {
                console.log("jetzt löschen");

                for (var i = data.length; i--;) {
                    console.log("i:", i);
                    //console.log(data[i].id,i, data.length);
                    var del = data[i].del;
                    delete data[i].inp;
                    delete data[i].del;
                    if (del) {

                        console.log("xhrCall", del, data[i]);

                        //xhrCall

                        data.splice(i, 1);
                    }
                }
                columns.splice(0, 1);
                table(data);



            } else {
                columns.unshift("inp");
                console.log("columns:", columns);
                data.forEach(function (d) {
                    d.inp = "<input type='checkbox'>";
                    d.del = false;
                });

                data.forEach(function (d) {
                    console.log(d);
                });
                table(data);

            }


        };//end Delete




        //Funktion wird an Zelle angefügt und macht Zelle editierbar
        //beim Verlassen oder Enter drücken wird Funktion fUpdate aufgerufen
        var make_editable = function (d, fUpdate) {
            if (columns[i] != "inp") {

                var field = d.column;
                this
                 // .on("mouseover", function () {
                 //     d3.select(this).style("fill", "red");
                 // })
                 // .on("mouseout", function () {
                 //     d3.select(this).style("fill", null);
                 // })
                  .on("click", function (d, i) {

                      if ((columns[i] != "BEZ" && !d.dat.children)) {
                          //console.log("columns[i]", columns[i])
                          var p = this.parentNode;
                          //console.log("columns[0]", columns[0]);
                          // HTML input form zum Inhalt editieren...
                          var el = d3.select(this);
                          var p_el = d3.select(p);

                          el.html("");

                          var frm = p_el.append("span");

                          var inp = frm
                                      .append("input")
                                          .attr("class", "form-control")
                                          .attr("placeholder", d.column)
                                          .attr("value", function () {
                                              this.focus();
                                              return d.dat[d.column];
                                          })
                                          //.attr("style", "width: 294px;")
                                          // make the form go away when you jump out (form looses focus) or hit ENTER:
                                          .on("blur", function () {
                                              var txt = inp.node().value;
                                              d.dat[d.column] = parseInt(txt) || txt;
                                              if (txt == "") {
                                                  el.html(function () { return "-" });
                                              } else {

                                                  el.html(function (d) { return d.dat[d.column]; });
                                              }

                                              //Daten updaten
                                              fUpdate(d);

                                              //formular entfernen
                                              frm.remove();

                                          })
                                          .on("keypress", function (event) {

                                              // IE fix
                                              if (!event) { event = window.event; }
                                              var e = event;
                                              if (e.keyCode == 13) {
                                                  if (typeof (e.cancelBubble) !== 'undefined') // IE
                                                      e.cancelBubble = true;
                                                  if (e.stopPropagation)
                                                      e.stopPropagation();
                                                  e.preventDefault();
                                                  var txt = inp.node().value;
                                                  d.dat[d.column] = parseInt(txt) || txt;
                                                  if (txt == "") {
                                                      el.html(function () { return "-" });
                                                  } else {
                                                      el.html(function (d) { return d.dat[d.column]; });
                                                  }

                                                  //Daten updaten
                                                  fUpdate(d);

                                                  //formular entfernen
                                                  frm.remove();
                                              }
                                          });
                      }

                  }); //end click!!
            } else {

                this.on("click", function (d) {
                    if (d.column == "inp") {
                        console.log(d);
                        d.dat.del = d3.select(this).select("input").node().checked;
                    }
                });

            }

        }; //END editable;

        return tabulate;
    }


   export function HtmlTreeTable() {
        //mit Array als Input
        var width = 500
        , mClass = 'tree';
        var f1 = function (d) { console.log(d); }; //Platzhalter
        var columns = [];
        var columnNames = [];
        var mformat = false;
        var mClassHead, mClassDiv, mClassBody;
        var meditable = false;

        function htmlTreeTable(selection) {

            selection.each(function (data) {

                var tdata = data;//.slice(0,20);

                var fUpdate = function (d) {
                    console.log("fUpdate_neu", d, data.filter(function (u) { return u.id == d.dat.id; }));
                };

                if (columns.length == 0) { for (var i in data[0]) { columns.push(i); } columnNames = columns; }

                var a = Tabulate();
                a.columns(columns)
                    .columnNames(columnNames)
                    .mClassHead(mClassHead)
                    .mClassBody(mClassBody)
                    .mClassDiv(mClassDiv)
                    .mformat(mformat)
                    .editable(meditable)
                    .fUpdate(fUpdate)
                    .fonClick(function (event, d) { console.log(d); });

                selection.datum(tdata).call(a);

                var onClk = function (d, i) {
                    //console.log(d,i);
                    var clkLevel = parseInt(this.dataset.level);
                    //console.log("this.parentNode", this.parentNode.tagName, this.parentNode.nodeName.toString().trim());
                    var a0 = d3.select(this.parentNode).selectAll('tr');
                    var dArray = a0.nodes();
                    var lev = 0;
                    var ex = false;
                    //console.log(this.parentNode.tagName, "TBODY", this.parentNode.tagName === "TBODY")
                    //if (this.parentNode.tagName === "TBODY") {
                    for (var j = i  ; j < dArray.length; j++) {
                        //console.log(j)
                        var d = dArray[j];
                        if (parseInt(d.dataset.level) <= clkLevel) {
                            //ex = true;
                            break;
                        }
                        if (this.parentNode.tagName === "TBODY") {
                            if (d.className.indexOf('collapsed') > -1) {
                                //console.log("d", d);
                                //Level = eins höher als Clicklevel
                                if ((parseInt(d.dataset.level) == (clkLevel + 1))) {
                                    //d3.select(d).classed("expanded", true).classed("collapsed", false);
                                    d.className = 'expanded'
                                    //.classed({ 'expanded': true, 'collapsed': false });
                                }
                            } else {
                                //wenn eingeblendet war, dann ausblenden
                                d.className = 'collapsed'
                                //d3.select(d).classed("expanded", false).classed("collapsed", true);
                            }
                        }
                    }
                };

                var b = selection.selectAll('tr');
                b.on("click", onClk);
                b.on("dblclick", function (d, i) {
                    var a0 = d3.select(this.parentNode).selectAll('tr');
                    a0.nodes().forEach(function (d) { d3.select(d).style('background-color', ''); });
                    d3.select(this).style('background-color', 'yellow')
                    ; f1.apply(this, [tdata[i - 1], i]);
                });
                // };
            });

            return htmlTreeTable;
        }

        //Expose public Variables
        htmlTreeTable.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return htmlTreeTable;
        };

        htmlTreeTable.root = function (_) {
            if (!arguments.length) return root;
            root = _;
            return htmlTreeTable;
        };

        htmlTreeTable.f1 = function (_) {
            if (!arguments.length) return f1;
            f1 = _;
            return htmlTreeTable;
        };

        htmlTreeTable.mClassHead = function (_) {
            if (!arguments.length) return mClassHead;
            mClassHead = _;
            return htmlTreeTable;
        };

        htmlTreeTable.mClassBody = function (_) {
            if (!arguments.length) return mClassBody;
            mClassBody = _;
            return htmlTreeTable;
        };

        htmlTreeTable.mClassDiv = function (_) {
            if (!arguments.length) return mClassDiv;
            mClassDiv = _;
            return htmlTreeTable;
        };

        htmlTreeTable.columns = function (_) {
            if (!arguments.length) return columns;
            columns = _;
            return htmlTreeTable;
        };

        htmlTreeTable.columnNames = function (_) {
            if (!arguments.length) return columnNames;
            columnNames = _;
            return htmlTreeTable;
        };

        htmlTreeTable.mformat = function (_) {
            if (!arguments.length) return mformat;
            mformat = _;
            return htmlTreeTable;
        };

        return htmlTreeTable;
    }


    //Beschreiben: 
    //tab_Input_array  
   export function tabInput_array() {

        var data = []
            , id = 'id'
            , pid = 'pid'
            , cols = function (d) { return { id: d.ID, pid: d.PID, BEZ: d.BEZ, sum1: d.stj_1, sum2: d.stj_2, sum3: d.stj_3, sum4: d.stj_4, sum5: 0, path: [] }; }
            , root = 1
            , hierarchyFilter
            , arrValues = ["sum1", "sum2", "sum3", "sum4", "sum5"]
        ;

        function table() {
            var otable = {}
                , tableArray = []
                , ii = 0
                , l = 1;
            traverse(tree(), 0);
            if (hierarchyFilter !== undefined) {
                var filterArray = [];
                //alle ids aus path-array zusammensetzen und unique machen!
                tableArray.filter(function (d) {
                    if (hierarchyFilter.indexOf(d.id) == -1) {
                        return false;
                    } else {
                        return true;
                    }
                }).forEach(function (d) { filterArray = filterArray.concat(d.path); })
                filterArray = uniqueArray(filterArray);
                tableArray = tableArray.filter(function (d) {
                    if (filterArray.indexOf(d.id.toString()) == -1) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }

            return tableArray;

            function tree() {
                var childrenById = [];
                var pathById = [];
                // of the form id: [child-ids]
                var nodes = [];
                // of the form id: {name: children: }

                //Funktion liefert einen NULL-Wert (anstatt 0!!!), wenn beide Werte r1 und r2 NULL sind
                function fdelta(r1, r2) {
                    if (!r1 && !r2) {
                        return null;
                    } else {
                        return r1 - r2;
                    }
                }
                // first pass: build child arrays and initial node array
                data.forEach(function (d) {
                    nodes[d[id]] = cols(d); //<---neu!!!
                    nodes[d[id]].children = [];

                    // root is used to mark the root's "parent"
                    //console.log("nodes", nodes)
                    if (childrenById[d[pid]] === undefined) {
                        childrenById[d[pid]] = [d[id]];
                    } else if (d[id] !== root) {
                        childrenById[d[pid]].push(d[id]);
                    }
                });


                // second pass: build tree, using the awesome power of recursion!
                // it does a bit of magic
                function expand(id, path) {
                    //console.log("nodes", nodes[id]);
                    path.push(id);
                    nodes[id].path = path.slice(0); //[Array mit dem Hierarchie-Pfad]
                    //wrapedJSObject can become extremly big!
                    nodes.wrapedJSObject = null;
                    if (childrenById[id] !== undefined) {
                        childrenById[id].forEach(function (d, i) {
                            var childId = childrenById[id][i];
                            //Recursion
                            var expChildID = expand(childId, path.slice(0));
                            nodes[id].children.push(expChildID);
                            //Summenbildung über Hierarchie (nur Felder im Array arrValues definiert sind)
                            arrValues.forEach(function (d) {
                                nodes[id][d] += expChildID[d];
                            });

                            //nodes[id].sum1 += expChildID.sum1;
                            //nodes[id].sum2 += expChildID.sum2;
                            //nodes[id].sum3 += expChildID.sum3;
                            //nodes[id].sum4 += expChildID.sum4;
                            //nodes[id].sum5 += expChildID.sum5;
                        });
                    }

                    return nodes[id];
                }

                return expand(root, []); //end tree;
            }

            function traverse(o, level) {
                o.level = level;
                tableArray.push(o);
                //console.log(o);
                for (var i in o) {
                    if (i === "children") {
                        level += 1;
                        o[i].forEach(function (d) { traverse(d, level); });
                    }
                }
            }

        }
        //============================================================
        // Expose Public Variables
        //------------------------------------------------------------
        table.data = function (_) {
            if (!arguments.length) return data;
            data = _;
            return table;
        };

        table.cols = function (_) {
            if (!arguments.length) return cols;
            cols = _;
            return table;
        };

        table.id = function (_) {
            if (!arguments.length) return id;
            id = _;
            return table;
        };

        table.pid = function (_) {
            if (!arguments.length) return pid;
            pid = _;
            return table;
        };

        table.root = function (_) {
            if (!arguments.length) return root;
            root = _;
            return table;
        };

        table.hierarchyFilter = function (_) {
            if (!arguments.length) return hierarchyFilter;
            hierarchyFilter = _;
            return table;
        };

        table.arrValues = function (_) {
            if (!arguments.length) return arrValues;
            arrValues = _;
            return table;
        };

        return table;
    } // End UBD.tabInput_array()



   export function simpleHtmlTabelle() {

        var columns = ["id", "Function"];
        var mclass = "tab";
        var fonclick = function (event) { };

        function tabelle(selection) {
            //console.log(selection);
            selection.each(function (data) {

                var table = selection.append("table").attr("class", mclass);

                var thead = table.append("thead");

                thead.selectAll("tr").data(columns).enter().append("th").text(function (d) { return d; });

                var tbody = table.append("tbody");
                // create a row for each object in the data
                var rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr")
                    .on("click", fonclick);

                // create a cell in each row for each column
                var cells = rows.selectAll("td")
                    .data(function (row) {
                        return columns.map(function (column) {
                            //console.log(column, row);
                            return { column: column, value: row[column] };
                        });
                    })
                    .enter()
                    .append("td")
                    //.attr("style", "font-family: Courier") // sets the font style
                        .html(function (d) { return d.value; });

            });

            return tabelle;
        }

        tabelle.mclass = function (_) {
            if (!arguments.length)
                return mclass;
            mclass = _;
            return tabelle;
        };

        tabelle.columns = function (_) {
            if (!arguments.length)
                return columns;
            columns = _;
            return tabelle;
        };

        tabelle.fonclick = function (_) {
            if (!arguments.length)
                return fonclick;
            fonclick = _;
            return tabelle;
        };

        return tabelle;
    }

   export  function simpleHtmlTableScroll() {

        var fonclick = function (event, d) { console.log(d); };
        var cols, width, height;
        var mClass = "zebra";
        var expandCollapse = false;
        var editable = false; 
        var fUpdate = function (d) { console.log("fupdate", d); };
        var inputData;
        var formatNumbers = function (d) { return d; };
        var fClass = function (x) { if (x.level > 1) { return "collapsed"; } };
        var selection;
        var rows;
        
        //mit cols werden die Spalten der Tabelle definiert
        //id = attributName; name = Bezeichner; width = Spaltenbreite in px; 
        //align = Ausrichtung; paddingLeft/Right = Zellenrand; 
        //style = Schattierung = keine; 1: hell, 2: dunkel (Verwendung bei Kalender Sa/So!)
        //Beispiel:
        // [{id:"Title", name:"Der Titel", width: 200, align:"left", paddingLeft:10, paddingRight:10, style:0}
        // ,{id:"Date", name:"Das Datum", width: 200, align:"left", paddingLeft:20, paddingRight:0, style:0}
        // ,{id:"Author", name:"Der Autor", width: 200, align:"right", paddingLeft:20, paddingRight:5, style:0}
        // ,{id:"Category", name:"Die Kategorie", width: 200, align:"right", paddingLeft:20, paddingRight:25, style:0}
        // ]

        function htmlTable(_selection) {

            selection = _selection;

            selection.each(function (data, i) {
                inputData = data;

                if (selection.property("offsetWidth") === 0) {
                    var data0 = data[0];
                }
                

                selection.html("");
                if (!width) width = selection.property("offsetWidth");
                if (!height) height = selection.property("offsetHeight");
                //console.log("height", height);

                if (!cols) { cols = Object.keys(data[0]).map(function (d) { return { id: d, name: d, width: 100, paddingLeft: 0, paddingRight: 0, align: "left" } }); }

                //Tabelle
                var tab = selection.append("table")
                    .attr("class", mClass)
                    .attr("style", "border-spacing: 0px; display: block; position: relative; left:5px; width:" + width + "px; height:" + height + "px;");

                //Header
                var thead = tab.append("thead")
                    .attr("style", "display: block; position: absolute; top: 0px;");
                 
                thead.selectAll("tr")
                .data(cols)
                .enter()
                .append("th")
                .text(function (d) { return d.name; })
                    ;

                //Body
                var tbody = tab.append("tbody").attr("class", "scroll4");
               // tbody.on("visibilitychange", function (d) { console.log("visibility", d, selection.node().visibilityState); })

               // console.log("style('display')", tbody.style("visibility"));


                // create a row for each object in the data
                 rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr")
                    .on("click", (function () {
                        //const e = selection.nodes();
                        //const i = e.indexOf(this);

                        if (expandCollapse) { return fCollapseExpand; } else { return fonclick; }
                    })()) 
                    //.on("click", fonclick)
                    .attr("data-level", function (d) { return d.level || 1; })
                    .attr("class", fClass);
               // function (x) { if (x.level > 1) { return "collapsed"; } }

                //Zellen
                var cells = rows.selectAll("td")
                    .data(function (row) {
                        return cols.map(function (d) {
                            return { column: d.id, value: row[d.id], level: row.level || 0 , RowData:row};
                        });
                    })
                    .enter()
                    .append("td")//.text("dummy")
                    .html(function (x) {
                        if (x.column === cols[0].id && x.hasOwnProperty("level")) {
                            return "<div style='padding-left:" + (x.level - 1) * 15  + "px;'>" + x.value.toString() + "</div>";
                        } else {
                            return formatNumbers(x.value);
                        }
                        
                    })
                    
                    .attr("style", function (d, i) {
                        var style = "";
                        if (cols[0].hasOwnProperty("width")) style += "width:" + (cols[i].width) + "px; ";
                        if (cols[0].hasOwnProperty("paddingLeft")) style += "padding-left:" + cols[i].paddingLeft + "px; ";
                        if (cols[0].hasOwnProperty("paddingRight")) style += "padding-right:" + cols[i].paddingRight + "px; ";
                        if (cols[0].hasOwnProperty("align")) style += "text-align:" + cols[i].align + ";";
                        if (cols[0].hasOwnProperty("style")) {
                            if (cols[i].style === 1) { style += "background-color:#f6f5f5;"; }
                            else if (cols[i].style === 2) { style += "background-color:#d7d7d7;"; }
                        }
                        //if (i == 0 && d.level > 1) style += "padding-left:" + (d.level - 1) * 15 + "px;"; 

                        return style;
                    });

                if (editable) cells.call(make_editable, fUpdate);

                
                

                //apply Header width according to actual (calculated) column width!
                var a = d3.select(selection.select("tbody").selectAll("tr").nodes()[0]).selectAll("td").nodes();             
                var b = thead.selectAll("th").nodes()
                

                a.forEach(function (d, i) {
                    //console.log(i, a.length - 1)
                    var pRight = cols[i].paddingRight;
                    var pLeft = cols[i].paddingLeft;
                    var mOffsetWidth = d.offsetWidth;

                    var mWidth;
                    if (mOffsetWidth > 0) {
                        if (cols[0].hasOwnProperty("width") && cols[0].hasOwnProperty("paddingLeft") && cols[0].hasOwnProperty("paddingRight")) mWidth = (mOffsetWidth - pLeft - pRight)
                        else if (cols[0].hasOwnProperty("width") && cols[0].hasOwnProperty("paddingRight")) mWidth = (mOffsetWidth - pRight)
                        else if (cols[0].hasOwnProperty("width") && cols[0].hasOwnProperty("paddingLeft")) mWidth = (mOffsetWidth - pLeft)
                        else if (cols[0].hasOwnProperty("width")) mWidth = (mOffsetWidth);

                    } else {
                        mWidth = cols[i].width; 
                    }

                    var style = "";
                    style += "width:" + mWidth + "px; ";
                    if (cols[0].hasOwnProperty("paddingLeft")) { style += "padding-left:" + pLeft + "px; " }
                    if (cols[0].hasOwnProperty("paddingRight")) { style += "padding-right:" + pRight + "px; " }
                    if (cols[0].hasOwnProperty("align")) { style += "text-align:" + cols[i].align + ";"; }
                    if (cols[0].hasOwnProperty("style")) {
                        if (cols[i].style == 1) { style += "background-color:#f6f5f5;" }
                        else if (cols[i].style == 2) { style += "background-color:#d7d7d7;" }
                    }

                    d3.select(b[i]).attr("style", style);
                    
                });

                //console.log("height", selection.select("thead").nodes()[0].offsetHeight);
                var theadHeight = selection.select("thead").nodes()[0].offsetHeight;
                selection.select("tbody")
                    .attr("style", "display: block; position: absolute; top: 20px; overflow-y: scroll; overflow-x: hidden; height:" + (height - theadHeight) + "px;");

                //thead eine zusätzliche Spalte mit Breite Scrollbar einfügen!!
                var scrollWidth = (tbody.nodes()[0].offsetWidth - tbody.nodes()[0].clientWidth)
                //console.log(tbody.nodes()[0].offsetWidth, tbody.nodes()[0].clientWidth, tbody.nodes()[0]);
                thead.append("th").attr("style", "width:" + scrollWidth + "px;");
                

            }); //selection.each

            
        } //htmlTable(selection)

        function fCollapseExpand(event, d) {
            const e = rows.nodes();//selection.selectAll("tr").nodes();
            const i = e.indexOf(this);
            fonclick(event, d, i, this);
            var clkLevel = parseInt(this.dataset.level);
            //console.log("this.parentNode", this.parentNode.tagName, this.parentNode.nodeName.toString().trim());
            var a0 = d3.select(this.parentNode).selectAll('tr');
            var dArray = a0.nodes();
            //var lev = 0;
            //var ex = false;
            //console.log(this.parentNode.tagName, "TBODY", this.parentNode.tagName === "TBODY")
            //if (this.parentNode.tagName === "TBODY") {
            for (var j = i + 1; j < dArray.length; j++) {
                //console.log(j)
                var dd = dArray[j];
                if (parseInt(dd.dataset.level) <= clkLevel) {
                    //ex = true;
                    break;
                }
                if (this.parentNode.tagName === "TBODY") {
                    if (dd.className.indexOf('collapsed') > -1) {
                        //console.log("d", d);
                        //Level = eins höher als Clicklevel
                        if ((parseInt(dd.dataset.level) === (clkLevel + 1))) {
                            //d3.select(d).classed("expanded", true).classed("collapsed", false);
                            dd.className = 'expanded';
                            //.classed({ 'expanded': true, 'collapsed': false });
                        }
                    } else {
                        //wenn eingeblendet war, dann ausblenden
                        dd.className = 'collapsed';
                        //d3.select(d).classed("expanded", false).classed("collapsed", true);
                    }
                }
            }

            var boxSize = ubdTinyTools.getBoxSizeFromElement(this.firstChild);// ubdTinyTools.getBoxSizeFromElement(this.firstChild);

            d3.select(this.parentNode.parentNode.firstChild.firstChild).style("width", boxSize.width + "px");
        }


        //Funktion wird an Zelle angefügt und macht Zelle editierbar
        //beim Verlassen oder Enter drücken wird Funktion fUpdate aufgerufen
        function make_editable (d, fUpdate) {
            if (cols[0].id != "inp") {
                //var field = cols[0].id;
                d
                    // .on("mouseover", function () {
                    //     d3.select(this).style("fill", "red");
                    // })
                    // .on("mouseout", function () {
                    //     d3.select(this).style("fill", null);
                    // })
                    .on("dblclick", function (event, d) {
                        //var p = this//.parentNode;
                        console.log(d)
                        // HTML input form zum Inhalt editieren...
                        var el;
                       // if (this.childNodes[0].nodeType == 1) { el = d3.select(this.childNodes[0]); } else { el = d3.select(this);}
                        el = d3.select(this);
                         
                        el.html("");

                        //var frm = el.append("div");

                        var inp = el
                            .append("input")
                            .attr("class", "form-control")
                            .attr("style", "width:" + parseInt(this.offsetWidth - 26) + "px; height:" + parseInt(this.offsetHeight - 6) +"px;")
                            .attr("placeholder", d.column)
                            .attr("value", function () {
                                this.focus();
                                return d.value;//d.dat[d.column];
                            })
                            //.attr("style", "width: 294px;")
                            // make the form go away when you jump out (form looses focus) or hit ENTER:
                            .on("blur", function () {
                                var txt = inp.node().value;
                                d.value = txt;
                                //d.dat[d.column] = txt;
                                if (txt == "") {
                                    el.select("div").html("-");
                                    //el.html(function () { return "-" });
                                } else {

                                    el.html(d.value);
                                    //el.select("div").html(d.value);
                                    //el.html(function (d) { return d.value; });
                                    //el.html(function (d) { return d.dat[d.column]; });
                                }

                                //Daten updaten
                                //this.__data__.value = d.value;
                                console.log(this.__data__.RowData[this.__data__.column])
                                this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d.value.trim())
                                
                                fUpdate(this.__data__.RowData);

                                //formular entfernen
                                //frm.select("input").remove();
                               // inp.remove();

                            })
                            .on("keypress", function (event,d) {
                                console.log(d);

                                // IE fix
                                if (!event) { event = window.event; }
                                var e = event;
                                if (e.keyCode == 27) {

                                    console.log("escape", e);
                                    el.html(d.value);
                                    return;
                                }

                                if (e.keyCode == 13) {
                                    if (typeof (e.cancelBubble) !== 'undefined') // IE
                                        e.cancelBubble = true;
                                    if (e.stopPropagation)
                                        e.stopPropagation();
                                    e.preventDefault();
                                    var txt = inp.node().value;
                                    d.value = txt;
                                    //d.dat[d.column] = txt;
                                    if (txt == "") {
                                        el.html("-");
                                        //el.html(function () { return "-" });
                                    } else {
                                        //this.__data__.value = d.value;
                                        this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d.value)
                                        

                                        try {
                                            el.html(d.value);
                                            inp.remove();
                                            fUpdate(this.__data__.RowData);
                                        } catch {
                                            console.log("issue with blur")
                                        }
                                        
                                        //el.html(function (d) { return d.value; });
                                        //el.html(function (d) { return d.dat[d.column]; });
                                    }

                                    //Daten updaten
                                    

                                    //formular entfernen
                                    //
                                   // return;
                                }
                            });
                    }); //end okeypress

                d.on("click", function (event,d) {
                    if (d.column == "inp") {
                        console.log(d);
                        d.dat.del = d3.select(this).select("input").node().checked;
                    }
                });

            }

        } //END editable;

       //make editable mit "contentEditable"
       //plain-text only wird von Firefox nicht unterstützt (Stand Juli 22)
       function make_editable__(d, fUpdate) {
           if (cols[0].id != "inp") {
               //var field = cols[0].id;
               d
                   // .on("mouseover", function () {
                   //     d3.select(this).style("fill", "red");
                   // })
                   // .on("mouseout", function () {
                   //     d3.select(this).style("fill", null);
                   // })
                   .on("dblclick", function (event, d) {
                       //var p = this//.parentNode;
                       console.log(d)
                       // HTML input form zum Inhalt editieren...
                       var el;
                       // if (this.childNodes[0].nodeType == 1) { el = d3.select(this.childNodes[0]); } else { el = d3.select(this);}
                       el = d3.select(this);

                       //el.html("");

                       //var frm = el.append("div");

                       el.attr("contentEditable", "plaintext-only")

                       var inp = el
                       //    .append("input")
                       //    .attr("class", "form-control")
                       //    .attr("placeholder", d.column)
                       //    .attr("value", function () {
                       //        this.focus();
                       //        return d.value;//d.dat[d.column];
                       //    })
                           //.attr("style", "width: 294px;")
                           // make the form go away when you jump out (form looses focus) or hit ENTER:
                           .on("blur", function () {
                               var txt = inp.node().value;
                               d.value = txt;
                               //d.dat[d.column] = txt;
                               if (txt == "") {
                                   el.select("div").html("-");
                                   //el.html(function () { return "-" });
                               } else {
                                   el.attr("contentEditable", "false");
                                   //el.html(d.value);
                                   //el.select("div").html(d.value);
                                   //el.html(function (d) { return d.value; });
                                   //el.html(function (d) { return d.dat[d.column]; });
                               }

                               //Daten updaten
                               //this.__data__.value = d.value;

                               if (d3.select(this).select("div").node() == null) {
                                   this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d3.select(this).node().innerHTML.trim())
                               } else { 
                                   this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d3.select(this).select("div").node().innerHTML.trim())
                               }

                               console.log(this.__data__.RowData[this.__data__.column])

                               fUpdate(this.__data__.RowData);

                               //formular entfernen
                               //frm.select("input").remove();
                               // inp.remove();

                           })
                           .on("keypress", function (event, d) {
                               console.log(d);

                               // IE fix
                               if (!event) { event = window.event; }
                               var e = event;
                               if (e.keyCode == 27) {

                                   console.log("escape", e);
                                   el.html(d.value);
                                   return;
                               }

                               if (e.keyCode == 13) {
                                   if (typeof (e.cancelBubble) !== 'undefined') // IE
                                       e.cancelBubble = true;
                                   if (e.stopPropagation)
                                       e.stopPropagation();
                                   e.preventDefault();
                                   var txt = inp.node().value;
                                   d.value = txt;
                                   //d.dat[d.column] = txt;
                                   if (txt == "") {
                                       el.html("-");
                                       //el.html(function () { return "-" });
                                   } else {
                                       //this.__data__.value = this.innerHTML.trim();
                                       
                                       if (d3.select(this).select("div").node() == null) {
                                           this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d3.select(this).node().innerHTML.trim())
                                       } else {
                                           this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d3.select(this).select("div").node().innerHTML.trim())
                                       }
                                       el.attr("contentEditable", "false");
                                       //el.html(ubd.escape(this.innerHTML));

                                       console.log(this.__data__.RowData[this.__data__.column])

                                       try {
                                           
                                           
                                           fUpdate(this.__data__.RowData);
                                       } catch {
                                           console.log("issue with blur")
                                       }

                                       //el.html(function (d) { return d.value; });
                                       //el.html(function (d) { return d.dat[d.column]; });
                                   }

                                   //Daten updaten


                                   //formular entfernen
                                   //
                                   // return;
                               }
                           });
                   }); //end okeypress

               d.on("click", function (d) {
                   if (d.column == "inp") {
                       console.log(d);
                       d.dat.del = d3.select(this).select("input").node().checked;
                   }
               });

           }

       } //END editable;

      //



        htmlTable.fonclick = function (_) {
            if (!arguments.length)
                return fonclick;
            fonclick = _;
            return htmlTable;
        };

        htmlTable.cols = function (_) {
            if (!arguments.length)
                return cols;
            cols = _;
            return htmlTable;
        };

        htmlTable.height = function (_) {
            if (!arguments.length)
                return height;
            height = _;
            return htmlTable;
        };

        htmlTable.width = function (_) {
            if (!arguments.length)
                return width;
            width = _;
            return htmlTable;
        };

        htmlTable.mClass = function (_) {
            if (!arguments.length)
                return mClass;
            mClass = _;
            return htmlTable;
        };



        htmlTable.fClass = function (_) {
            if (!arguments.length)
                return fClass;
            fClass = _;
            return htmlTable;
        };

        

        htmlTable.expandCollapse = function (_) {
            if (!arguments.length)
                return expandCollapse;
            expandCollapse = _;
            return htmlTable;
        };

        htmlTable.editable = function (_) {
            if (!arguments.length)
                return editable;
            editable = _;
            return htmlTable;
        };

        htmlTable.fUpdate = function (_) {
            if (!arguments.length)
                return fUpdate;
            fUpdate = _;
            return htmlTable;
        };

        htmlTable.formatNumbers = function (_) {
            if (!arguments.length)
                return formatNumbers;
            formatNumbers = _;
            return htmlTable;
        };

        htmlTable.outputData = function () {

            //cols.forEach(function (d) {
            //    objData
            //    });
            var outputData = inputData.map(function (d, i) {
                var objData = {};
                cols.forEach(function (x) {
                    objData[x.name] = d[x.id];
                });
                return objData;
            });
            return outputData;
        };

        htmlTable.outputDataExtended = function () {

            //cols.forEach(function (d) {
            //    objData
            //    });
            //cols.push();
            var outputData = inputData.map(function (d, i) {
                var objData = {};
                cols.forEach(function (x) {
                    objData[x.name] = d[x.id];
                });
                objData['Team'] = d['PID'];
                return objData;
            });
            return outputData;
        };

        htmlTable.output = function () {
            //gibt die Inputdaten und die Spaltenüberschriften als Array zurück
            var output = [];
            output.push(inputData);
            output.push(cols);

            return output;
        };


        return htmlTable;

    }


    export function simpleHtmlTableScroll2() {

        var fonclick = function (event, d) { console.log(d); };
        var cols, width, height;
        var mClass = "zebra";
        var expandCollapse = false;
        var editable = false;
        var fUpdate = function (d) { console.log("fupdate", d); };
        var inputData;
        var formatNumbers = function (d) { return d; };
        var fClass = function (x) { if (x.level > 1) { return "collapsed"; } };
        var selection;
        var rows;

        //mit cols werden die Spalten der Tabelle definiert
        //id = attributName; name = Bezeichner; width = Spaltenbreite in px; 
        //align = Ausrichtung; paddingLeft/Right = Zellenrand; 
        //style = Schattierung = keine; 1: hell, 2: dunkel (Verwendung bei Kalender Sa/So!)
        //Beispiel:
        // [{id:"Title", name:"Der Titel", width: 200, align:"left", paddingLeft:10, paddingRight:10, style:0}
        // ,{id:"Date", name:"Das Datum", width: 200, align:"left", paddingLeft:20, paddingRight:0, style:0}
        // ,{id:"Author", name:"Der Autor", width: 200, align:"right", paddingLeft:20, paddingRight:5, style:0}
        // ,{id:"Category", name:"Die Kategorie", width: 200, align:"right", paddingLeft:20, paddingRight:25, style:0}
        // ]

        function htmlTable(_selection) {

            selection = _selection;

            selection.each(function (data, i) {
                inputData = data;

                if (selection.property("offsetWidth") === 0) {
                    var data0 = data[0];
                }


                selection.html("");
                if (!width) width = selection.property("offsetWidth");
                if (!height) height = selection.property("offsetHeight");
                if (!cols) { cols = Object.keys(data[0]).map(function (d) { return { id: d, name: d, width: 100, paddingLeft: 0, paddingRight: 0, align: "left" } }); }

                //Tabelle
                var tab = selection.append("table")
                    .attr("class", "ubd-table " + mClass)
                    .attr("style", "height:" + height + "px;")
    
                //Header
                var thead = tab.append("thead")
                    .attr("class", "ubd-thead")
                    .append("tr")
                    .attr("class", "ubd-tr")

                thead.selectAll("tr")
                    .data(cols)
                    .enter()
                    .append("th")
                    .attr("class", "ubd-th ubd-th-fixed")
                    .attr("tabindex", "0")
                    .text(function (d) { return d.name; })
                    //.attr("style", "min-width:" + cols[i].width + "px; width: " + cols[i].width + "px; top: 0px;")
                    .attr("style", function (d, i) { return "min-width:" + cols[i].width + "px; width: " + cols[i].width + "px; top: 0px; padding-left: "+cols[i].paddingLeft + "px; padding-right: "+cols[i].paddingRight+"px;"})
                    ;

                //Body
                var tbody = tab.append("tbody").attr("class", "ubd-tbody");
                // create a row for each object in the data
                rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr")
                    .on("click", (function () {
                        //const e = selection.nodes();
                        //const i = e.indexOf(this);

                        if (expandCollapse) { return fCollapseExpand; } else { return fonclick; }
                    })())
                    //.on("click", fonclick)
                    .attr("data-level", function (d) { return d.level || 1; })
                    .attr("class", fClass).classed("ubd-tr", true);
                
                //function (x) { if (x.level > 1) { return "collapsed"; } }

                //Zellen
                var cells = rows.selectAll("td")
                    .data(function (row) {
                        return cols.map(function (d) {
                            return { column: d.id, value: row[d.id], level: row.level || 0, RowData: row };
                        });
                    })
                    .enter()
                    .append("td")
                    .attr("class", "ubd-td")//.text("dummy")
                    .html(function (x) {
                        if (x.column === cols[0].id && x.hasOwnProperty("level")) {
                            return "<div style='padding-left:" + (x.level - 1) * 15 + "px;'>" + x.value.toString() + "</div>";
                        } else {
                            return formatNumbers(x.value);
                        }
                    })

                    .attr("style", function (d, i) {
                        var style = "";
                        //if (cols[0].hasOwnProperty("width")) style += "width:" + (cols[i].width) + "px; ";
                        if (cols[0].hasOwnProperty("paddingLeft")) style += "padding-left:" + cols[i].paddingLeft + "px; ";
                        if (cols[0].hasOwnProperty("paddingRight")) style += "padding-right:" + cols[i].paddingRight + "px; ";
                        if (cols[0].hasOwnProperty("align")) style += "text-align:" + cols[i].align + ";";
                        if (cols[0].hasOwnProperty("style")) {
                            if (cols[i].style === 1) { style += "background-color:#f6f5f5;"; }
                            else if (cols[i].style === 2) { style += "background-color:#d7d7d7;"; }
                        }
                        //if (i == 0 && d.level > 1) style += "padding-left:" + (d.level - 1) * 15 + "px;"; 

                        return style;
                    });

                if (editable) cells.call(make_editable, fUpdate);


            }); //selection.each


        } //htmlTable(selection)

        function fCollapseExpand(event, d) {
            const e = rows.nodes();//selection.selectAll("tr").nodes();
            const i = e.indexOf(this);
            fonclick(event, d, i, this);
            var clkLevel = parseInt(this.dataset.level);
            //console.log("this.parentNode", this.parentNode.tagName, this.parentNode.nodeName.toString().trim());
            var a0 = d3.select(this.parentNode).selectAll('tr');
            var dArray = a0.nodes();
            //var lev = 0;
            //var ex = false;
            //console.log(this.parentNode.tagName, "TBODY", this.parentNode.tagName === "TBODY")
            //if (this.parentNode.tagName === "TBODY") {
            for (var j = i + 1; j < dArray.length; j++) {
                //console.log(j)
                var dd = dArray[j];
                if (parseInt(dd.dataset.level) <= clkLevel) {
                    //ex = true;
                    break;
                }
                if (this.parentNode.tagName === "TBODY") {
                    if (dd.className.indexOf('collapsed') > -1) {
                        //console.log("d", d);
                        //Level = eins höher als Clicklevel
                        if ((parseInt(dd.dataset.level) === (clkLevel + 1))) {
                            //d3.select(d).classed("expanded", true).classed("collapsed", false);
                            dd.className = 'expanded';
                            //.classed({ 'expanded': true, 'collapsed': false });
                            
                        }
                    } else {
                        //wenn eingeblendet war, dann ausblenden
                        dd.className = 'collapsed';
                        //d3.select(d).classed("expanded", false).classed("collapsed", true);
                    }
                }
            }

            var boxSize = ubdTinyTools.getBoxSizeFromElement(this.firstChild);// ubdTinyTools.getBoxSizeFromElement(this.firstChild);

            d3.select(this.parentNode.parentNode.firstChild.firstChild).style("width", boxSize.width + "px");
        }


        //Funktion wird an Zelle angefügt und macht Zelle editierbar
        //beim Verlassen oder Enter drücken wird Funktion fUpdate aufgerufen
        function make_editable(d, fUpdate) {
            if (cols[0].id != "inp") {
                //var field = cols[0].id;
                d
                    // .on("mouseover", function () {
                    //     d3.select(this).style("fill", "red");
                    // })
                    // .on("mouseout", function () {
                    //     d3.select(this).style("fill", null);
                    // })
                    .on("dblclick", function (event, d) {
                        //var p = this//.parentNode;
                        console.log(d)
                        // HTML input form zum Inhalt editieren...
                        var el;
                        // if (this.childNodes[0].nodeType == 1) { el = d3.select(this.childNodes[0]); } else { el = d3.select(this);}
                        el = d3.select(this);

                        el.html("");

                        //var frm = el.append("div");

                        var inp = el
                            .append("input")
                            .attr("class", "form-control")
                            .attr("style", "width:" + parseInt(this.offsetWidth - 26) + "px; height:" + parseInt(this.offsetHeight - 6) + "px;")
                            .attr("placeholder", d.column)
                            .attr("value", function () {
                                this.focus();
                                return d.value;//d.dat[d.column];
                            })
                            //.attr("style", "width: 294px;")
                            // make the form go away when you jump out (form looses focus) or hit ENTER:
                            .on("blur", function () {
                                var txt = inp.node().value;
                                d.value = txt;
                                //d.dat[d.column] = txt;
                                if (txt == "") {
                                    el.select("div").html("-");
                                    //el.html(function () { return "-" });
                                } else {

                                    el.html(d.value);
                                    //el.select("div").html(d.value);
                                    //el.html(function (d) { return d.value; });
                                    //el.html(function (d) { return d.dat[d.column]; });
                                }

                                //Daten updaten
                                //this.__data__.value = d.value;
                                console.log(this.__data__.RowData[this.__data__.column])
                                this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d.value.trim())

                                fUpdate(this.__data__.RowData);

                                //formular entfernen
                                //frm.select("input").remove();
                                // inp.remove();

                            })
                            .on("keypress", function (event, d) {
                                console.log(d);

                                // IE fix
                                if (!event) { event = window.event; }
                                var e = event;
                                if (e.keyCode == 27) {

                                    console.log("escape", e);
                                    el.html(d.value);
                                    return;
                                }

                                if (e.keyCode == 13) {
                                    if (typeof (e.cancelBubble) !== 'undefined') // IE
                                        e.cancelBubble = true;
                                    if (e.stopPropagation)
                                        e.stopPropagation();
                                    e.preventDefault();
                                    var txt = inp.node().value;
                                    d.value = txt;
                                    //d.dat[d.column] = txt;
                                    if (txt == "") {
                                        el.html("-");
                                        //el.html(function () { return "-" });
                                    } else {
                                        //this.__data__.value = d.value;
                                        this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d.value)


                                        try {
                                            el.html(d.value);
                                            inp.remove();
                                            fUpdate(this.__data__.RowData);
                                        } catch {
                                            console.log("issue with blur")
                                        }

                                        //el.html(function (d) { return d.value; });
                                        //el.html(function (d) { return d.dat[d.column]; });
                                    }

                                    //Daten updaten


                                    //formular entfernen
                                    //
                                    // return;
                                }
                            });
                    }); //end okeypress

                d.on("click", function (d) {
                    if (d.column == "inp") {
                        console.log(d);
                        d.dat.del = d3.select(this).select("input").node().checked;
                    }
                });

            }

        } //END editable;

        //make editable mit "contentEditable"
        //plain-text only wird von Firefox nicht unterstützt (Stand Juli 22)
        function make_editable__(d, fUpdate) {
            if (cols[0].id != "inp") {
                //var field = cols[0].id;
                d
                    // .on("mouseover", function () {
                    //     d3.select(this).style("fill", "red");
                    // })
                    // .on("mouseout", function () {
                    //     d3.select(this).style("fill", null);
                    // })
                    .on("dblclick", function (event, d) {
                        //var p = this//.parentNode;
                        console.log(d)
                        // HTML input form zum Inhalt editieren...
                        var el;
                        // if (this.childNodes[0].nodeType == 1) { el = d3.select(this.childNodes[0]); } else { el = d3.select(this);}
                        el = d3.select(this);

                        //el.html("");

                        //var frm = el.append("div");

                        el.attr("contentEditable", "plaintext-only")

                        var inp = el
                            //    .append("input")
                            //    .attr("class", "form-control")
                            //    .attr("placeholder", d.column)
                            //    .attr("value", function () {
                            //        this.focus();
                            //        return d.value;//d.dat[d.column];
                            //    })
                            //.attr("style", "width: 294px;")
                            // make the form go away when you jump out (form looses focus) or hit ENTER:
                            .on("blur", function () {
                                var txt = inp.node().value;
                                d.value = txt;
                                //d.dat[d.column] = txt;
                                if (txt == "") {
                                    el.select("div").html("-");
                                    //el.html(function () { return "-" });
                                } else {
                                    el.attr("contentEditable", "false");
                                    //el.html(d.value);
                                    //el.select("div").html(d.value);
                                    //el.html(function (d) { return d.value; });
                                    //el.html(function (d) { return d.dat[d.column]; });
                                }

                                //Daten updaten
                                //this.__data__.value = d.value;

                                if (d3.select(this).select("div").node() == null) {
                                    this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d3.select(this).node().innerHTML.trim())
                                } else {
                                    this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d3.select(this).select("div").node().innerHTML.trim())
                                }

                                console.log(this.__data__.RowData[this.__data__.column])

                                fUpdate(this.__data__.RowData);

                                //formular entfernen
                                //frm.select("input").remove();
                                // inp.remove();

                            })
                            .on("keypress", function (event, d) {
                                console.log(d);

                                // IE fix
                                if (!event) { event = window.event; }
                                var e = event;
                                if (e.keyCode == 27) {

                                    console.log("escape", e);
                                    el.html(d.value);
                                    return;
                                }

                                if (e.keyCode == 13) {
                                    if (typeof (e.cancelBubble) !== 'undefined') // IE
                                        e.cancelBubble = true;
                                    if (e.stopPropagation)
                                        e.stopPropagation();
                                    e.preventDefault();
                                    var txt = inp.node().value;
                                    d.value = txt;
                                    //d.dat[d.column] = txt;
                                    if (txt == "") {
                                        el.html("-");
                                        //el.html(function () { return "-" });
                                    } else {
                                        //this.__data__.value = this.innerHTML.trim();

                                        if (d3.select(this).select("div").node() == null) {
                                            this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d3.select(this).node().innerHTML.trim())
                                        } else {
                                            this.__data__.RowData[this.__data__.column] = ubdTinyTools.escape(d3.select(this).select("div").node().innerHTML.trim())
                                        }
                                        el.attr("contentEditable", "false");
                                        //el.html(ubd.escape(this.innerHTML));

                                        console.log(this.__data__.RowData[this.__data__.column])

                                        try {


                                            fUpdate(this.__data__.RowData);
                                        } catch {
                                            console.log("issue with blur")
                                        }

                                        //el.html(function (d) { return d.value; });
                                        //el.html(function (d) { return d.dat[d.column]; });
                                    }

                                    //Daten updaten


                                    //formular entfernen
                                    //
                                    // return;
                                }
                            });
                    }); //end okeypress

                d.on("click", function (d) {
                    if (d.column == "inp") {
                        console.log(d);
                        d.dat.del = d3.select(this).select("input").node().checked;
                    }
                });

            }

        } //END editable;

        //



        htmlTable.fonclick = function (_) {
            if (!arguments.length)
                return fonclick;
            fonclick = _;
            return htmlTable;
        };

        htmlTable.cols = function (_) {
            if (!arguments.length)
                return cols;
            cols = _;
            return htmlTable;
        };

        htmlTable.height = function (_) {
            if (!arguments.length)
                return height;
            height = _;
            return htmlTable;
        };

        htmlTable.width = function (_) {
            if (!arguments.length)
                return width;
            width = _;
            return htmlTable;
        };

        htmlTable.mClass = function (_) {
            if (!arguments.length)
                return mClass;
            mClass = _;
            return htmlTable;
        };



        htmlTable.fClass = function (_) {
            if (!arguments.length)
                return fClass;
            fClass = _;
            return htmlTable;
        };



        htmlTable.expandCollapse = function (_) {
            if (!arguments.length)
                return expandCollapse;
            expandCollapse = _;
            return htmlTable;
        };

        htmlTable.editable = function (_) {
            if (!arguments.length)
                return editable;
            editable = _;
            return htmlTable;
        };

        htmlTable.fUpdate = function (_) {
            if (!arguments.length)
                return fUpdate;
            fUpdate = _;
            return htmlTable;
        };

        htmlTable.formatNumbers = function (_) {
            if (!arguments.length)
                return formatNumbers;
            formatNumbers = _;
            return htmlTable;
        };

        htmlTable.outputData = function () {

            //cols.forEach(function (d) {
            //    objData
            //    });
            var outputData = inputData.map(function (d, i) {
                var objData = {};
                cols.forEach(function (x) {
                    objData[x.name] = d[x.id];
                });
                return objData;
            });
            return outputData;
        };

        htmlTable.outputDataExtended = function () {

            //cols.forEach(function (d) {
            //    objData
            //    });
            //cols.push();
            var outputData = inputData.map(function (d, i) {
                var objData = {};
                cols.forEach(function (x) {
                    objData[x.name] = d[x.id];
                });
                objData['Team'] = d['PID'];
                return objData;
            });
            return outputData;
        };

        htmlTable.output = function () {
            //gibt die Inputdaten und die Spaltenüberschriften als Array zurück
            var output = [];
            output.push(inputData);
            output.push(cols);

            return output;
        };


        return htmlTable;

    } 


   export function getAllChildren(pid) {
        /**
         * @param {(Array|string)} obj
         * @param {number} p
         * @return {Array}
         */
        function getNestedChildren2(obj, p) {
            /** @type {Array} */
            var out = [];
            obj.forEach(function (d) {
                if (d.pid == p) {
                    var children = getNestedChildren2(obj, d.id);
                    if (children.length) {
                        d.children = children;
                    }
                    allChildren.push(d.id);
                    out.push(d);
                }
            });
            return out;
        }
        /**
         * @return {?}
         */
        function Elements(pid) {
            allChildren = [];
            getNestedChildren2(data, pid);
            allChildren.push(pid);
            return allChildren;
        }
        /**
         * @param {Array} _
         * @return {?}
         */
        Elements.data = function (_) {
            if (!arguments.length) {
                return data;
            }
            /** @type {Array} */
            data = _;
            return Elements;
        };
        /**
         * @param {number} _
         * @return {?}
         */
        Elements.pid = function (_) {
            if (!arguments.length) {
                return pid;
            }
            /** @type {number} */
            pid = _;
            //console.log(pid);
            return Elements;
        };

        /** @type {Array} */
        var data = [];
        /** @type {number} */
        //var pid = 0;
        /** @type {Array} */
        var allChildren = [];
        return Elements;
    }


    //d3.select("#grid2").datum([3, 4]).call(ubdTabellen.Grid().cl("bx cbo_l"));
  export  function Grid() {

        var cl = "bx cbo_l";

        function grid(selection) {
            selection.each(function (data) {
                selection.html("");
                var a = selection.append("div").attr("class", "dT");
                var ind = 0;
                for (var i = 1; i <= data[0]; i++) {
                    a.append("div").attr("class", "dTR");
                    for (var k = 1; k <= data[1]; k++) {
                        a.append("div").attr("class", "dTC " + cl + " grid" + ind);
                        ind += 1;
                    }
                }
            });
        }

        grid.cl = function (_) {
            if (!arguments.length) return cl;
            cl = _;
            return grid;
        };

        return grid;
    }

    function uniqueArray(array) {
        var temp = array.reduce(function (previous, current) {
            previous[current] = true;
            return previous;
        }, {});

        return Object.keys(temp);
    }


   export function ExpandCollapse() {
        return function onClk(d, i) {
            console.log(d, i);
            var clkLevel = parseInt(this.dataset.level);
            //console.log("this.parentNode", this.parentNode.tagName, this.parentNode.nodeName.toString().trim());
            var a0 = d3.select(this.parentNode).selectAll('tr');
            var dArray = a0.nodes();
            // var lev = 0;
            // var ex = false;
            //console.log(this.parentNode.tagName, "TBODY", this.parentNode.tagName === "TBODY")
            //if (this.parentNode.tagName === "TBODY") {
            for (var j = i + 1  ; j < dArray.length; j++) {
                //console.log(j)
                var d = dArray[j];
                if (parseInt(d.dataset.level) <= clkLevel) {
                    //ex = true;
                    break;
                }
                if (this.parentNode.tagName === "TBODY") {
                    if (d.className.indexOf('collapsed') > -1) {
                        //console.log("d", d);
                        //Level = eins höher als Clicklevel
                        if ((parseInt(d.dataset.level) == (clkLevel + 1))) {
                            //d3.select(d).classed("expanded", true).classed("collapsed", false);
                            d.className = 'expanded'
                            //.classed({ 'expanded': true, 'collapsed': false });
                        }
                    } else {
                        //wenn eingeblendet war, dann ausblenden
                        d.className = 'collapsed'
                        //d3.select(d).classed("expanded", false).classed("collapsed", true);
                    }
                }
            }
       };



     


    }
