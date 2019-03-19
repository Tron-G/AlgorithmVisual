function draw() {
    let introduce = $("#introduce");
    // let imgs = $("#imgs");

    let svg1 = d3.select("#introduce")
        .append("svg")
        .attr("id", "introduce_svg")
        .attr("width", introduce.width())
        .attr("height", introduce.height());

    // let svg2 = d3.select("#imgs")
    //     .append("svg")
    //     .attr("id", "imgs_svg")
    //     .attr("width", imgs.width())
    //     .attr("height", imgs.height());

}
draw();

