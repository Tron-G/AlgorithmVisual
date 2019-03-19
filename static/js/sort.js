function draw() {
    let dataset = [ 5 , 7 , 1 , 2 , 4 ];
    let array = $("#screen");

    let width=array.width();
    let height=array.height();

    let svg=d3.select("#screen")
            .append("svg")
            .attr("id","array_svg")
            .attr("width",width)
            .attr("height",height);

    let rectHeight = 25;

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append('g')
        .attr("class","gg")
        .attr('id', function (d, i) {
            return "g" + i;
        })
        .append("rect")
        .attr("x", function (d, i) {
            return i * rectHeight + 50;
        })
        .attr("y",50)
        .attr("width",rectHeight-2)
        .attr("height",rectHeight -2)
        .attr("fill","steelblue");

    svg.selectAll('.gg')
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr('x',function(d,i){
             return i * rectHeight+50;
        })
        .attr('y',65);

}
draw();