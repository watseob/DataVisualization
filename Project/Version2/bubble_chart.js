
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


        var maxAmount = d3.max(rawData, function(d){ return +d.height/+d.weight})
        var maxAvg = d3.max(rawData, function(d){ return +d.avg})


        var radiusScale = d3.scaleLinear()
            .domain([0, maxAmount])
            .range([0.01, 0.05]);

        var avgScale = d3.scaleLinear()
            .domain([0, maxAvg])
            .range([0,1]);


        var myNodes = rawData.map(function (d) {
            return {
                name: d.name,
                radius: radiusScale(+d.HR),
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





        nodes = createNodes(rawData);

        svg = d3.select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height', height);



        bubbles = svg.selectAll('.bubble')
            .data(nodes, function (d) { return d; });


        var bubblesE = bubbles.enter().append('circle')
            .classed('bubble', true)
            .attr('r', 0)
            .attr('fill', function(d) { return d3.interpolateYlGn(+d.col) })
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


        groupBubbles();
    };

    var change = function(d) {


        var stat = d3.select('svg').classed('stat')
        var which = d3.selectAll('.selected').attr('id');


        if (which === 'hand'){

            if (!stat) {
                d3.selectAll('circle').transition()
                    .duration(500).attr('r',5)

                simulation.force('x', d3.forceX().strength(forceStrength).x(nodesHandPos))
                .force('y', d3.forceY().strength(forceStrength).y(center.y))
                .force('charge', d3.forceManyBody().strength(-1.8));
                simulation.alpha(1).restart();

                d3.select('svg').classed('stat',true);

            }else{



                d3.selectAll('circle').transition()
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



                svg.select(".xaxis").transition()
                    .duration(500)
                    .attr("transform", "translate(0," +(height-padding)+")")
                    .call(xAxis);

                svg.select(".yaxis").transition()
                    .duration(500)
                    .call(yAxis)
                    .attr("transform","translate("+padding+",0)");

                d3.selectAll('circle').transition()
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

                d3.selectAll("circle")
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



                d3.selectAll("circle")
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

                    simulation.stop()
                    d3.select('svg').classed('stat',true);


            }else{
                console.log('else')
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

    function groupBubbles(d) {
        hideHandTitles();
        d3.selectAll('circle').transition()
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



        d3.selectAll("circle")
            .transition()
            .duration(2000)
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



            d3.selectAll("circle")
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

                simulation.stop()

            }

    chart.toggleDisplay = function (displayName) {
        if (displayName === 'hand') {
            simulation.alpha(1).restart();
            svg.selectAll("g")
                .remove()
            d3.selectAll("circle")
                .style('opacity',1)
                .style('display','inline-block')

            splitBubbles();
        } else if (displayName === 'bmi') {


            sortBubbles();
        } else if (displayName === 'avg') {
            d3.selectAll("circle")
                .style('opacity',1)
                .style('display','inline-block')


            avgBubbles();
        } else {
            simulation.alpha(1).restart();
            svg.selectAll("g")
                .remove()
            d3.selectAll("circle")
                .style('opacity',1)
                .style('display','inline-block')

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
