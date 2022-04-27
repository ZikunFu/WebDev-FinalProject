window.onload = function() {
    const margin = {top: 30, right: 30, bottom: 70, left: 60};
	const width = 500 - margin.left - margin.right;
	const height = 500 - margin.top - margin.bottom;
			
	const svg = d3.select("#chart")
	  .append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", `translate( ${margin.left} , ${margin.top} )`);
			  
			
	const x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(user.map(d => d.name))
	  .padding(0.2);
	svg.append("g")
	  .attr("transform", `translate(0, ${height} )`)
	  .call(d3.axisBottom(x))
      
		
			
		 const y = d3.scaleLinear()
		   .domain([0, 15])
		   .range([ height, 0]);
		 svg.append("g")
		   .call(d3.axisLeft(y));
			
		 svg.selectAll("mybar")
		   .data(user)
		   .enter()
		   .append("rect")
		 	.attr("x", d => x(d.name))
		 	.attr("y", d => y(d.point))
		 	.attr("width", x.bandwidth())
		 	.attr("height", d => height - y(d.point))
		 	.attr("fill", "#ffff00")
    
             svg.append('text')
             .attr('x',width)
             .attr('y',height)
             .text('user')

             svg.append('text')
             .attr('x',0)
             .attr('y',0)
             .text('win-loss')       
};

//rank table
$(document).ready(function(){
	let rank = $('#rank');
        let tbody = $('<tbody>');
        for(y=user.length-1; y>=0; y--){
            let tr = $('<tr>');
                let td1 = $('<td>');
                td1.text(user[y].name);
                tr.append(td1)
                let td2 = $('<td>');
                td2.text(user[y].point);
                tr.append(td2)
                tbody.append(tr) 
            tbody.append(tr)
        }
        rank.append(tbody)
})