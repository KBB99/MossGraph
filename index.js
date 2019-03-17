var d3 = require("d3");
const people_coordinates = []
const people_list = []

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var weightsRange = document.getElementById("weightsRange")
var weight = document.getElementById("weight")
const people_data = {}

output.innerHTML = slider.value;

weight.innerHTML = weightsRange.value;

weightsRange.oninput = function(){
  weight.innerHTML = weightsRange.value;
}

slider.oninput = function() {
  output.innerHTML = this.value;
}

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    var lines = contents.split('\n');
    try {
      var x = 100
      var y = 100
      var w = 0
      for (var i = 0; i<lines.length-1;i++) {
        var space_split = lines[i].split(' ')
        var person1 = space_split[0] + ' ' + space_split[1]
        people_coordinates.push([x,y,w])
        x += 100
        if (x == 800){
          x = 100
          y += 100
        }
        var person2 = space_split[3] + ' ' + space_split[4]
        people_coordinates.push([x,y,w])
        x += 100
        if (x == 800){
          x = 100
          y += 100
        }
        var same_lines = space_split[5]
        if (!people_list.includes(person1)) {
          people_list.push(person1)
        }
        if (!people_list.includes(person2)) {
          people_list.push(person2)
        }
        if (person1 == undefined || person2 == undefined) {
        }
        else if (people_data[person1+person2] == undefined){
          if (same_lines >= slider.value){
            people_data[person1+' '+person2] = same_lines * (weightsRange.value / 10)
            index1 = people_list.indexOf(person1)
            people_coordinates[index1][2] += (same_lines) * (weightsRange.value / 10)
            index2 = people_list.indexOf(person2)
            people_coordinates[index2][2] += (same_lines) * (weightsRange.value / 10)
          }
        }
        else {
          if (same_lines >= slider.value){
            people_data[person1+' '+person2] += same_lines * (weightsRange.value / 10)
            index1 = people_list.indexOf(person1)
            people_coordinates[index1][2] += (same_lines) * (weightsRange.value / 10)
            index2 = people_list.indexOf(person2)
            people_coordinates[index2][2] += (same_lines) * (weightsRange.value / 10)
          }
        }
      }
      for (var i = 0; i < people_list.length; i++){
        createNewElement(people_list[i],i)
      }
      Object.keys(people_data).map(function(key) {
        var linear_similar = people_data[key]
        var split_key = key.split(" ")
        var person1 = split_key[0] + " " + split_key[1]
        var person2 = split_key[2] + " " + split_key[3]
        addConnection(person1,person2)
      })
    }
    catch (err) {
      console.log(err)
    }
    };
  reader.readAsText(file);
}

function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.textContent = contents;
}

function createNewElement(person,i) {
  try{
    var x = people_coordinates[i][0]
    var y = people_coordinates[i][1]
    var w = people_coordinates[i][2]
    d3.select("#graph").append("circle").attr("cx",x).attr("cy",y).attr("r",w).on("mouseover",() => handleMouseOver(person)).on("mouseout",() => handleMouseOut(person)).style("fill","grey").attr("id",person).append("title").text(person)
}
  catch (err){
    console.log(err)
  }
}

function handleMouseOver(person) {
  try{
    for (var i = 0; i < Object.keys(people_data).length; i++){
      const people_string = Object.keys(people_data)[i]
      if (people_string.includes(person)){
        console.log('True')
        console.log(d3.select(people_string).attr("class","empty"))
        d3.select(people_string).attr("class","empty");
      }
    }
  }
  catch (err){
    console.log(err)
  }
}

function handleMouseOut(person) {

}

function addConnection(p1,p2) {
  try {
    var index1 = people_list.indexOf(p1)
    var index2 = people_list.indexOf(p2)
    var x1 = people_coordinates[index1][0]
    var y1 = people_coordinates[index1][1]
    var x2 = people_coordinates[index2][0]
    var y2 = people_coordinates[index2][1]
    d3.select("#graph").append("line").attr("class","person").attr("x1",x1).attr("y1",y1).attr("x2",x2).attr("y2",y2).attr("id",p1+ " " + p2)
  }
  catch (err) {
    console.log(err)
  }
}

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);
