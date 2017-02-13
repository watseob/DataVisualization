
function bubbleChart() {

    var width = 1000;
    var height = 550;
    var padding  = 50;



    var center = { x : width / 2, y : height / 2};

    var handCenters = {
        L : { x : width / 3,     y : height / 2 },
        B : { x : width / 2,     y : height / 2 },
        R : { x : width * 2 / 3, y : height / 2}
    };

    var handTitleX = {
        L : width / 4,
        B : width / 2,
        R : width * (3/4)
    };

    var forceStrength = 0.03;

    var svg = null;
    var bubbles = null;
    var nodes = [];


    // math.pow ????
    function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
    };

    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

        //tick ???

    simulation.stop();


    var fillColor = d3.scaleOrdinal()
        .domain(['L','B','R'])
        .range(['#F2BDBE','#88B04B','#7F95C5']);










    function createNodes(rawData) {


        var maxAmount = d3.max(rawData, function(d){ return Math.sqrt(+d.HR)})



        var radiusScale = d3.scaleLinear()
            .domain([0, maxAmount])
            .range([0, 25]);

        var avgScale = d3.scaleLinear()
            .domain([0, 0.4])
            .range([0,1]);


        var myNodes = rawData.map(function (d) {
            return {
                name: d.name,
                radius: radiusScale(Math.sqrt(+d.HR)),
                hr : +d.HR,
                hand : d.handedness,
                height : +d.height,
                weight : +d.weight,
                avg : +d.avg,
                col : avgScale(+d.avg),
                x : Math.random() * 900,
                y : Math.random() * 800
            };
        });

        myNodes.sort(function (a,b) {return b.hr - a.hr; });

        return myNodes;

    }

    var chart = function chart(selector, rawData) {

        var xmax = d3.max(rawData, function(d){
            return +d.weight;
        })

        var ymax = d3.max(rawData, function(d){
            return +d.height
        })

        var color = d3.scaleSequential(d3.interpolateYlGnBu);



        nodes = createNodes(rawData);

        svg = d3.select(selector)
        .append('svg')
        .classed('main',true)
        .attr('width', width)
        .attr('height', height);


        bubbles = svg.selectAll('.bubble')
            .data(nodes, function (d) { return d; });


        var bubblesE = bubbles.enter().append('circle')
            .classed('bubble', true)
            .attr('r', 0)
            .attr('fill', function(d) { return d3.interpolateYlGnBu(+d.col) })
            .attr('stroke', 'black')
            .attr('stroke-width', 0.2)
            .on('mouseover', showTooltip)
            .on('mouseout', hideTooltip)
            .on('click', change);


        bubbles = bubbles.merge(bubblesE);


        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) { return d.radius; });

        simulation.nodes(nodes);


        groupBubbles(rawData);
        allLayout(rawData)
    };

    var change = function(d) {


        var stat = d3.select('svg').classed('stat')
        var which = d3.selectAll('.selected').attr('id');


        if (which === 'hand'){

            if (!stat) {
                d3.selectAll('.bubble').transition()
                    .duration(500).attr('r',5)

                simulation.force('x', d3.forceX().strength(forceStrength).x(nodesHandPos))
                .force('y', d3.forceY().strength(forceStrength).y(center.y))
                .force('charge', d3.forceManyBody().strength(-1.8));
                simulation.alpha(1).restart();

                d3.select('svg').classed('stat',true);

            }else{



                d3.selectAll('.bubble').transition()
                    .duration(500).attr('r',function(d){
                    return d.radius;
                })
                simulation.force('charge', d3.forceManyBody().strength(charge))

                splitBubbles()
                d3.select('svg').classed('stat',false);

            }

            //console.log('Hand')
        }else if (which === 'bmi'){
            console.log('bmi')

            if (!stat) {


                var xScale = d3.scaleLinear()
                    .domain([18, 33])
                    .range([padding, width-padding]);

                var yScale = d3.scaleLinear()
                    .domain([0.2, 0.310])
                    .range([height-padding, padding]);

                var xAxis = d3.axisBottom(xScale)
                    .tickArguments([20],'f');


                var yAxis = d3.axisLeft(yScale)
                    .tickArguments([20]);


                d3.select(".ylabel")
                   .text("hr")

                d3.select(".xlabel")
                   .text("bmi")



                svg.select(".xaxis").transition()
                    .duration(500)
                    .attr("transform", "translate(0," +(height-padding)+")")
                    .call(xAxis);

                svg.select(".yaxis").transition()
                    .duration(500)
                    .call(yAxis)
                    .attr("transform","translate("+padding+",0)");

                d3.selectAll('.bubble').transition()
                    .duration(500).attr('cx',function(d){
                        var bmi = (+d.weight*703)/(+d.height * +d.height)
                        return xScale(bmi)
                    } )
                    .attr('cy', function(d){
                        return yScale(+d.avg)
                    }).style('display',function(d){
                        if (+d.hr < 100) {
                            return "none"
                        }

                    })
                d3.select('svg').classed('stat',true);



            }else{
                console.log('back')

                d3.select(".ylabel")
                   .text("height")

                d3.select(".xlabel")
                   .text("weight")
                var xScale = d3.scaleLinear()
                    .domain([130, 250])
                    .range([padding, width-padding]);

                var yScale = d3.scaleLinear()
                    .domain([60, 80])
                    .range([height-padding, padding]);

                var xAxis = d3.axisBottom(xScale)
                    .tickArguments([20],'f');


                var yAxis = d3.axisLeft(yScale)
                    .tickArguments([20]);

                svg.select(".xaxis").transition()
                    .duration(500)
                    .attr("transform", "translate(0," +(height-padding)+")")
                    .call(xAxis);

                svg.select(".yaxis").transition()
                    .duration(500)
                    .call(yAxis)
                    .attr("transform","translate("+padding+",0)");

                d3.selectAll(".bubble")
                    .transition()
                    .duration(500)
                    .attr('cx',function(d){
                        return xScale(d.weight)
                    })
                    .attr('cy',function(d){
                        return yScale(+d.height)
                    }).style('opacity',0.5)

                    .attr('stroke-width',0.2)
                    .style('display',"inline-block")
                    ;

                d3.select('svg').classed('stat',false);
            }



        }else if (which === 'avg'){
            if (!stat) {

                hideHandTitles();
                console.log('avg Bubbles')
                var xScale = d3.scaleLinear()
                    .domain([0, 0.35])
                    .range([padding, width-padding]);

                var yScale = d3.scaleLinear()
                    .domain([0, 600])
                    .range([height-padding, padding]);


                var xAxis = d3.axisBottom(xScale)
                    .tickArguments([20],'f');


                var yAxis = d3.axisLeft(yScale)
                    .tickArguments([10]);

                svg.selectAll("g")
                    .remove()


                svg.append("g")
                    .attr("transform", "translate(0," +(height-padding)+")")
                    .attr("class", "xaxis")
                    .call(xAxis);

                svg.append("g")
                    .attr("transform","translate("+padding+",0)")
                    .attr("class", "yaxis")
                    .call(yAxis);



                d3.selectAll(".bubble")
                    .transition()
                    .duration(2000)
                    .attr('cx',function(d){
                        return xScale(d.avg)
                    })
                    .attr('cy',function(d){
                        return yScale(+d.hr)
                    }).style('opacity',0.6)
                    .attr('stroke-width',0.2)
                    .attr('r',function(d){
                        return d.radius
                    })
                    ;

                    d3.select(".main").append("text")
                       .attr("class","ylabel")
                       .attr("text-anchor", "middle")
                       .attr("transform", "translate(15,"+(height/2)+")rotate(-90)")
                       .text("hr")

                    d3.select(".main").append("text")
                       .attr("class","xlabel")
                       .attr("text-anchor", "middle")
                       .attr("transform", "translate("+ (width/2) +","+(height-5)+")")
                       .text("avg")


                    simulation.stop()

                    d3.select('svg').classed('stat',true);



            }else{
                console.log('else')

                d3.select('.xlabel')
                    .text('avg')

                d3.select('.ylabel')
                    .text('hr')
                avgBubbles()

                d3.select('svg').classed('stat',false);



            }

        }else{

        }


    }

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    function showTooltip(d) {

        d3.select(this).attr('stroke-width',3)

        tooltip
               .style("left", d3.event.pageX + 50 + "px")
               .style("top", d3.event.pageY+"px")
               .style("display", "inline-block")
               .html((d.name) + "<br>" + "height:" +
                    (d.height) + "<br>" + "weight:" +
                    (d.weight) + "<br>" + "avg:" +
                    (d.avg) + "<br>" + "hr:" +
                    (d.hr));

    }
    function hideTooltip() {
        d3.select(this).attr('stroke-width',0.2)
        tooltip.style("display", "none");
    }



    function ticked() {
        bubbles
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });

    }

    function nodesHandPos(d) {
        return handCenters[d.hand].x;
    }

    function groupBubbles() {
        hideHandTitles();
        d3.select('#vis').selectAll('.bubble').transition()
            .duration(500).attr('r',function(d){
            return d.radius;
        })
        simulation.force('charge', d3.forceManyBody().strength(charge))

        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));


        simulation.alpha(1).restart();



    }

    function splitBubbles() {

        showHandTitles()

        simulation.force('x', d3.forceX().strength(forceStrength).x(nodesHandPos));

        simulation.alpha(1).restart();
    }

    function hideHandTitles() {
        svg.selectAll('text').remove();
    }

    function showHandTitles() {

        var handsData = d3.keys(handTitleX);
        var hand = svg.selectAll('.hand')
            .data(handsData);

        hand.enter().append('text')
            .attr('class','hand')
            .attr('x', function (d) { return handTitleX[d];})
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(function (d) { return d; });
    }

    function allLayout(data) {

        var meanHr = d3.mean(data, function(d) {
            return +d.HR || +d.hr})
        var meanAvg = d3.mean(data, function(d) {
            return +d.avg})
        var medianHr = d3.median(data, function(d){
            return +d.HR || +d.hr
        })
        var medianAvg = d3.median(data, function(d){
            return +d.avg
        })
        console.log(meanHr)
        var radiusScale = d3.scaleLinear()
            .domain([0, Math.sqrt(563)])
            .range([0, 25]);

        d3.select('#mean')
            .append('circle')
            .attr('r',function(d){
                return radiusScale(Math.sqrt(meanHr))
            })
            .attr('fill', function(d) { return d3.interpolateYlGnBu(meanAvg) })
            .attr('cx',100)
            .attr('cy',50)

        d3.select('#median')
            .append('circle')
            .attr('r',function(d){
                return radiusScale(medianHr)
            })
            .attr('fill', function(d) { return d3.interpolateYlGnBu(medianAvg) })
            .attr('cx',100)
            .attr('cy',50)


        d3.select('#circle_size')
            .append('circle')
            .attr('r',function(){
                return radiusScale(Math.sqrt(500))
            })
            .attr('cx',100)
            .attr('cy',50)
            .style("stroke-dasharray", ("2"))
            .style('fill','none')
            .style('stroke','black')


        d3.select('#circle_size')
            .append('circle')
            .attr('r',function(){
                return radiusScale(Math.sqrt(300))
            })
            .attr('cx',100)
            .attr('cy',55)
            .style("stroke-dasharray", ("2"))
            .style('fill','none')
            .style('stroke','black')

        d3.select('#circle_size')
            .append('circle')
            .attr('r',function(){
                return radiusScale(Math.sqrt(100))
            })
            .attr('cx',100)
            .attr('cy',63)
            .style("stroke-dasharray", ("2"))
            .style('fill','none')
            .style('stroke','black')


        var xScale = d3.scaleLinear()
            .domain([0, 0.4])
            .range([0, 150]);

        var xAxis = d3.axisBottom(xScale)
            .ticks(5);

        d3.select('#color')
            .append("g")
            .attr("transform", "translate(20,50)")
            .call(xAxis);


        var color = d3.scaleSequential(d3.interpolateYlGnBu);

        var legend = d3.select('#color')
            .selectAll(".legend")
            .data(color.ticks(10).slice(1))
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(" +(20 + (i * 15)) + "," + (35) + ")"; });

        legend.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", color);

    }




    function sortBubbles() {
        hideHandTitles();
        console.log('Sort Bubbles')
        var xScale = d3.scaleLinear()
            .domain([130, 250])
            .range([padding, width-padding]);

        var yScale = d3.scaleLinear()
            .domain([60, 80])
            .range([height-padding, padding]);


        var xAxis = d3.axisBottom(xScale)
            .tickArguments([20],'f');


        var yAxis = d3.axisLeft(yScale)
            .tickArguments([20]);

        svg.selectAll("g")
            .remove()


        svg.append("g")
            .attr("transform", "translate(0," +(height-padding)+")")
            .attr("class", "xaxis")
            .call(xAxis);

        svg.append("g")
            .attr("transform","translate("+padding+",0)")
            .attr("class", "yaxis")
            .call(yAxis);



        d3.select(".main").append("text")
           .attr("class","ylabel")
           .attr("text-anchor", "middle")
           .attr("transform", "translate(15,"+(height/2)+")rotate(-90)")
           .text("height")

        d3.select(".main").append("text")
           .attr("class","xlabel")
           .attr("text-anchor", "middle")
           .attr("transform", "translate("+ (width/2) +","+(height-5)+")")
           .text("weight")




        d3.selectAll(".bubble")
            .transition()
            .duration(500)
            .attr('cx',function(d){
                return xScale(d.weight)
            })
            .attr('cy',function(d){
                return yScale(+d.height)
            }).style('opacity',0.6)
            .attr('stroke-width',0.2)
            .attr('r',function(d){
                return d.radius
            })
            ;

            simulation.stop()

        }

        function avgBubbles() {
            hideHandTitles();
            console.log('avg Bubbles')
            var xScale = d3.scaleLinear()
                .domain([0, 0.35])
                .range([padding, width-padding]);

            var yScale = d3.scaleLinear()
                .domain([0, 200])
                .range([height-padding, padding]);


            var xAxis = d3.axisBottom(xScale)
                .tickArguments([20],'f');

                d3.select(".main").append("text")
                   .attr("class","ylabel")
                   .attr("text-anchor", "middle")
                   .attr("transform", "translate(15,"+(height/2)+")rotate(-90)")
                   .text("hr")

                d3.select(".main").append("text")
                   .attr("class","xlabel")
                   .attr("text-anchor", "middle")
                   .attr("transform", "translate("+ (width/2) +","+(height-5)+")")
                   .text("avg")


            var yAxis = d3.axisLeft(yScale)
                .tickArguments([20]);

            svg.selectAll("g")
                .remove()


            svg.append("g")
                .attr("transform", "translate(0," +(height-padding)+")")
                .attr("class", "xaxis")
                .call(xAxis);

            svg.append("g")
                .attr("transform","translate("+padding+",0)")
                .attr("class", "yaxis")
                .call(yAxis);



            d3.selectAll(".bubble")
                .transition()
                .duration(1000)
                .attr('cx',function(d){
                    return xScale(d.avg)
                })
                .attr('cy',function(d){
                    return yScale(+d.hr)
                }).style('opacity',0.6)
                .attr('stroke-width',0.2)
                .attr('r',function(d){
                    return d.radius
                })
                ;

                simulation.stop()

            }

    chart.toggleDisplay = function (displayName) {
        var pan = d3.select("#clicks")

        if (displayName === 'hand') {
            pan.text("Click bubble to see the numbers of player for each group")
            simulation.alpha(1).restart();

            d3.select('.all_scale').style('display','none');
            d3.select('.summary').style('display','none');

            svg.selectAll("g")
                .remove()
            d3.selectAll("circle")
                .style('opacity',1)
                .style('display','inline-block')

            d3.select('.xlabel').remove()
            d3.select('.ylabel').remove()

            splitBubbles();
        } else if (displayName === 'bmi') {
            pan.text("Click bubble to see graph ( bmi vs hr > 100 )")
            d3.select('.all_scale').style('display','none');
            d3.select('.summary').style('display','none');

            sortBubbles();
        } else if (displayName === 'avg') {
            pan.text("Click bubble to change y axis range")
            d3.selectAll(".bubble")
                .style('opacity',1)
                .style('display','inline-block')
            d3.select('.all_scale').style('display','none');
            d3.select('.summary').style('display','none');



            avgBubbles();
        } else {
            pan.text("Mouseover show data in a detail")
            simulation.alpha(1).restart();
            svg.selectAll("g")
                .remove()
            d3.selectAll(".bubble")
                .style('opacity',1)
                .style('display','inline-block')
            d3.select('.all_scale').transition().duration(500)
            .style('display','inline');
            d3.select('.summary').transition().duration(500)
            .style('display','inline');
            d3.select('.xlabel').remove()
            d3.select('.ylabel').remove()

            groupBubbles();
        }
    };

    return chart;
}


var myBubbleChart = bubbleChart();


function display(error,data) {
    if(error) {
        console.log(error);
    }

    myBubbleChart('#vis',data);
}


function setupButtons() {
    d3.select('#toolbar')
        .selectAll('.button')
        .on('click', function () {
            d3.selectAll('.button').classed('selected', false);


            var button = d3.select(this);

            button.classed('selected', true);

            var buttonId = button.attr('id');

            myBubbleChart.toggleDisplay(buttonId);

        });
}



d3.csv('baseball_data.csv', display);


setupButtons();
