//const baseUrl = "http://localhost/";
const baseUrl = "http://140.114.67.181/";
const tag = "#toolbar=0&navpanes=0";

var content;
var chart;

$("document").ready(function() {
    // Initialize tab content
    $("#searchBox").keyup(function(event){
        if(event.keyCode == 13){
            $("#searchBtn").click();
        }
    });
    $(".loader").css("visibility", "hidden");
    $.get(`${baseUrl}api/content`, function(data) {
        content = data;
        initContent();
    });

    // Initialize tab chart
    $.get(`${baseUrl}api/chart`, function(data) { 
        chart = data;
        appendDropdown1();
    });
    
    document.addEventListener('contextmenu', event => event.preventDefault());
});

// Content
function initContent() {
    let newHTML = content.map(function(obj1, index1, array){
        let newChapterContent;
        if(obj1.subsection){
            newChapterContent = obj1.subsection.map(function(obj2){
                return `<div class="subsections" data-toggle="modal" data-target="#pdf" onclick="showModal('${obj2.filename}', '${obj2.level}')">
                            <text>${obj2.text}</text>
                        </div>`;
            }).join('');
        }else{
            newChapterContent = obj1.section.map(function(obj2, index2){
                let newSectionContent = obj2.subsection.map(function(obj3){
                    return `<div class="subsections" data-toggle="modal" data-target="#pdf" onclick="showModal('${obj3.filename}', '${obj3.level}')">
                                <text>${obj3.text}</text>
                            </div>`;
                }).join('');
                return `<div class="chapter${index1} sections my-1">
                            <a data-toggle="collapse" data-parent="#ch${index1}_collapse" href="#ch${index1}_${index2}" aria-expanded="false" aria-controls="ch${index1}_${index2}">
                                ${obj2.text}
                            </a>
                            <div id="ch${index1}_${index2}" class="collapse ml-5 s_collapse" role="tabpanel">
                                ${newSectionContent}
                            </div>
                        </div>`;
            }).join('');
        }
        return `<div class="chapter  my-1">
                    <a class="ch" id="test" data-toggle="collapse" data-parent="#content" href="#ch${index1}" aria-expanded="false" aria-controls="ch${index1}">
                        ${obj1.text}
                    </a>
                    <div id="ch${index1}" class="collapse ml-5 c_collapse" role="tabpanel">
                        ${newChapterContent}
                    </div>
                </div>`;
    }).join('');
    $("#content").append(newHTML);
}

function showModal(filename, ref){
    var url = `${baseUrl}api/pdf/${filename}${tag}`;
    var modal_header_ref = document.getElementById('ref');
    var modal_header_text = document.getElementById('modal-header');
    document.getElementById("doc").setAttribute("src", url);

    if(ref){
        modal_header_ref.innerHTML = ref;
        switch(ref){
            case "A":
                modal_header_ref.style.color = "rgb(255, 0, 214)";
                break;
            case "B":
                modal_header_ref.style.color = "rgb(101, 174, 242)";
                break;
            case "C":
                modal_header_ref.style.color = "rgb(108, 242, 105)";
                break;
        }
        modal_header_text.innerHTML = '參考度&nbsp;&nbsp;';
    }else{
        modal_header_ref.innerHTML = "";
        modal_header_text.innerHTML = "";
    }
}

function handleBtnClick() {
    $("#searchIcon").css("visibility", "hidden");
    $(".loader").css("visibility", "visible");
    $("text").css("background-color", "transparent");
    search();
}

function search() {
    var input = $('#searchBox').val().toLowerCase();
    var chapters = $('.chapter');

    for(let i=0; i<chapters.length; i++){
        let c_open = false;
        let sections = chapters.eq(i).find('.sections');
        if(sections.length>0){
            for(let j=0; j<sections.length; j++){
                let s_open = false;
                let subsections = sections.eq(j).find('text');
                for(let k=0; k<subsections.length; k++){
                    if(subsections.eq(k).text().toLowerCase().match(input)){
                        subsections.eq(k).css("background-color", "rgba(255, 255, 0, 0.8)");
                        s_open = true;
                        c_open = true;
                    }else{

                    }
                }
                if(input&&s_open){
                    if($(".c_collapse").eq(i).hasClass("show")){
                        sections.eq(j).find(".s_collapse").collapse("show");
                    }else{
                        chapters.eq(i).find(".c_collapse").on("shown.bs.collapse", function() {
                            sections.eq(j).find(".s_collapse").collapse("show");
                            chapters.eq(i).find(".c_collapse").off("shown.bs.collapse");
                        });
                    }
                }else{
                    sections.eq(j).find(".s_collapse").collapse("hide");
                }
            }
        }else{
            let subsections = chapters.eq(i).find('text');
            for(let k=0; k<subsections.length; k++){
                if(subsections.eq(k).text().toLowerCase().match(input)){
                    subsections.eq(k).css("background-color", "rgba(255, 255, 0, 0.8)");
                    c_open = true;
                }else{

                }
            }
        }
        if(input&&c_open){
            chapters.eq(i).find(".c_collapse").collapse("show");
        }else{
            chapters.eq(i).find(".c_collapse").collapse("hide");
        }
    }
    searching = false;
    setTimeout(function() {
        $(".loader").css("visibility", "hidden");
        $("#searchIcon").css("visibility", "visible");
    }, 750);
}

// Chart
function appendDropdown1(){
    let newHTML1 = chart[0].map(function(obj, index){
        return `<span class='dropdown-item' onclick='appendDropdown2(1, ${index}); changeText("${obj.parent}", "#dropdown1-1_btn"); changeText("Choose...", "#dropdown1-2_btn"); changeText("", "#descriptionText1")'>${obj.parent}</span>`;
    });
    let newHTML2 = chart[1].map(function(obj, index){
        return `<span class='dropdown-item' onclick='appendDropdown2(2, ${index}); changeText("${obj.parent}", "#dropdown2-1_btn"); changeText("Choose...", "#dropdown2-2_btn"); changeText("", "#descriptionText2")'>${obj.parent}</span>`;
    });
    $(`#dropdown1-1`).append(newHTML1);
    $(`#dropdown2-1`).append(newHTML2);    
}

function appendDropdown2(chartNum, index){
    let toBeAppended = `#dropdown${chartNum}-2`;
    let toBeEnabled  = `#dropdown${chartNum}-2_btn`;
    let newHTML = chart[chartNum-1][index].child.map(function(obj){
        return `<span class='dropdown-item' href='#' onclick='showDescrip("${obj.description}", ${chartNum}); changeText("${obj.condition}", "#dropdown${chartNum}-2_btn")'>${obj.condition}</span>`;
    });
    $.when($(toBeAppended).empty()).then(function(){
        $(toBeAppended).append(newHTML);
    });
    $(toBeEnabled).prop("disabled", false);
}

function changeText(text, toBeChanged){
    $(toBeChanged).html(text);
}

function showDescrip(text, chartNum){
    let descriptionItem = `#descriptionText${chartNum}`;
    $(descriptionItem).html(text);
}
