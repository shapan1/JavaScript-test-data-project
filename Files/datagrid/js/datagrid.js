function DataGrid(data)
{
    var cell, row, table, tbody, columnKey;
    var order = new Array();
    for (var v = 0; v<data.columns.length; v++) {
        order[v] = false;
    }
    var totalRows = 0;
    var rowsforPage = data.data;
    var n = 0;
    var currentPage = 1;
    var pageSize = data.pageSize;
    for(var i=0; i<data.data.length; i++) {
        totalRows++;
    }
    var totalPages = Math.ceil(totalRows/pageSize);
    columnKey = data.columns[0].dataName;
    createTable();
    makeTableHeader(data);
    sortAscColumn(data,data.columns[0].dataName);
    order[0] = true;
    makeTableBody(data);
    // deprecated color method......
    // var tagsinit = document.getElementsByName(data.columns[0].dataName);
    //     for (i = 0; i< tagsinit.length;i++) {
    //         tagsinit[i].style.backgroundColor = "rgba(0,255,255,0.6)";
    //     }
    renderDisplay();
    function renderDisplay() {
        if (data.hasOwnProperty("onRender")){
            data.onRender();
        }
    }

    function createTable() {
        table = document.createElement('table');
        if (data.hasOwnProperty("pageSize")) {
            if(totalPages > 1) {
            var caption = document.createElement("caption");
            var previous = document.createElement("submit");
            var mid = document.createElement("span");
            var next = document.createElement("submit");
            
            previous.innerHTML = "<a id= \"previous\" > &lt previous </a>";
            previous.style.cursor = "pointer";
            next.innerHTML = "<a id= \"next\" > next &gt </a>";
            next.style.cursor = "pointer";
            mid.innerHTML = currentPage + " of " + totalPages;
            if (currentPage==1) {
                previous.style.color = "gray";
                previous.style.cursor = "auto";
            }else {
                previous.style.color = "blue";
                previous.style.cursor = "pointer";
            }
            if (currentPage==totalPages) {
                next.style.color = "gray";
                next.style.cursor = "auto";
            }else {
                next.style.color = "blue";
                next.style.cursor = "pointer";
            }
            previous.addEventListener("click", clickEventPage);
            next.addEventListener("click", clickEventPage);
            mid.disabled = true;
            next.disabled = true;

            caption.appendChild(previous);
            caption.appendChild(mid);
            caption.appendChild(next);

            table.appendChild(caption);

            caption.style.textAlign = "right";
            }
        }
        var header = table.createTHead();
        tbody =document.createElement('tbody');        
        headerRow = header.insertRow(0);
        table.appendChild(tbody);
        data.rootElement.appendChild(table);
    }

    function makeTableHeader(data) {
        for (var i = 0; i < data.columns.length; i++) {
                var headerObj = data.columns[i];
                var headerName = headerObj.name;
                cell = headerRow.insertCell(i);
                cell.innerHTML = "<a href=\"#\" id= " + headerObj.dataName + " title = \"sort by "+ headerName + "\"" + ">" + headerName + "</a>";
                cell.setAttribute("order", i);
                cell.addEventListener('click', clickEvent);
            }
    } 
    
    function sortAscColumn(data, i) {
        data.data.sort(function compare(a,b){
            if(a[i] < b[i])
                {return -1;}
            if(a[i] > b[i])
                {return 1;}
            if(a[i] == b[i])
                 {return 0;}
        });
    }
    function sortDescColumn(data, i) {
        data.data.sort(function compare(a,b){
            if(a[i] > b[i])
                {return -1;}
            if(a[i] < b[i])
                {return 1;}
             if(a[i] == b[i])
                 {return 0;}
        });
    }

    function makeTableBody(data) {
        if (data.hasOwnProperty('pageSize')){
            var lastpageIndex = ((currentPage-1)*pageSize) + pageSize;
            if (lastpageIndex> data.data.length) {
                lastpageIndex = data.data.length;
            }
        for(i = (currentPage-1)*pageSize ;i< lastpageIndex;i++){
                var obj = data.data[i];
                row = tbody.insertRow(-1);
                var counter = 0;
            for(var j = 0; j < data.columns.length; j++) {
                cell = row.insertCell(-1);
                var attrValue = obj[data.columns[j].dataName];
                cell.setAttribute("name", data.columns[j]["dataName"]);
                cell.style.textAlign = data.columns[j].align;
                cell.style.width = data.columns[j].width+"px";
                cell.innerHTML = attrValue;

                if (data.columns[j].dataName == columnKey) {
                    cell.style.backgroundColor = "rgba(0,255,255,0.6)";
                }

            }
        }   
        }else {
            for(var i=0;i< data.data.length;i++){
           var obj = data.data[i];
           row = tbody.insertRow(-1);
           var counter = 0;
           for(var j = 0; j < data.columns.length; j++) {
            cell = row.insertCell(-1);
            var attrValue = obj[data.columns[j].dataName];
            cell.setAttribute("name", data.columns[j]["dataName"]);
            cell.style.textAlign = data.columns[j].align;
            cell.style.width = data.columns[j].width+"px";
            cell.innerHTML = attrValue;
            if (data.columns[j].dataName == columnKey) {
                    cell.style.backgroundColor = "rgba(0,255,255,0.6)";
                }

            }
        }
        }
        
    }

    DataGrid.prototype.destroy= function() {
        var Tbl = document.getElementsByTagName('table')[0];
        Tbl.parentNode.removeChild(Tbl);
    }

    function clickEvent () {
        var headerId = event.target.id;
        if (headerId.length==0){
            return;
        }
        columnKey = headerId;
        var tableNode = event.currentTarget.parentNode.parentNode.parentNode;
        if (order[event.currentTarget.getAttribute("order")] == true) {
            sortDescColumn(data,headerId);
            for(var i=0; i<order.length;i++){
                order[i]= false;
            }
            order[event.currentTarget.getAttribute("order")] = false;
        }else {
            sortAscColumn(data,headerId);
            for(var i=0; i<order.length;i++){
                order[i]= false;
            }
            order[event.currentTarget.getAttribute("order")] = true;
        } 

        destroytable(tableNode);
        createTable();
        makeTableHeader(data);
        makeTableBody(data);
        // deprecated color method.....
        // var tags = tableNode.(headerId);
        // console.log(tags);
        // for (i = 0; i< tags.length;i++) {
        //     tags[i].style.backgroundColor = "rgba(0,255,255,0.6)";
        // }
        renderDisplay();
    }
    function destroytable(tab) {
        tab.parentNode.removeChild(tab);
    }

    function clickEventPage () {
        if (event.target.id === "previous") {
            if(currentPage == 1) {
                return;
            }
            currentPage--;
            var tableNode = event.currentTarget.parentNode.parentNode;
                destroytable(tableNode);
                createTable();
                makeTableHeader(data);
                makeTableBody(data);

        }else if(event.target.id === "next") {
            
            if (currentPage < totalPages) {
                currentPage++;
                var tableNode = event.currentTarget.parentNode.parentNode;
                destroytable(tableNode);
                createTable();
                makeTableHeader(data);
                makeTableBody(data);
            }
        }
        renderDisplay();
    }

}


