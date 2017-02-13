# Make effective Data Visualization.
  
[See the bubblechart](https://bl.ocks.org/watseob/77d87f836e6ae8aa6ddd60f5496783fe)  
  
***by Lim Joonseob.  
Edited : 2016 - 12 - 26  
Updated : 2017 - 1 - 24  
watseob@gmail.com***  
  
## Summary
  
This project is to make a interactive data visualization with baseball players.  
There are 1157 players and 6 features(name, handedness, height, weight, avg, hr) in dataset.  
Bubble size - HR.  
Color of bubble - AVG.  
There are 4 tabs(All, Hand, Bmi, Avg). you can see the ditribution of players by handedness by clikcing bubble in hand tab.
You can see the linear correlation betweeen weight and height in hand tab and relation between bmi and hr > 100 by clicking bubble. You can check exponential correlation between avg and height in avg tab and change y range by clicking bubble.
  
  
## Design
  
First, i thought a classic ways like histogram, bar chart and scatter plot. I really wanted to try different way to show data by creating interactive data visualization. I was highly inspired by watching the interactive bubble chart by Hans Rosling. I made the bubble chart which is grouped by using force function in D3.js in version 1. Next, i deleted summary tab and added axis to show relations between features. Finally, i changed the color of bubble and added labels to show what color and size of bubbles means.


## Feedback
  
- Scale  
"The size of bubbles look strange. You need to check if it is right."  
-I changed color and size of bubbles, because bubbles were exaggerated in scaling data.  
  
- Labels  
"We need labels which let us to compare bubbles with others."  
-I added labels which has information about size and color.  
  
- Axis  
"I think that adding an axis will be great to show relations between variables"  
-I asked people how i can show relations between variables. I wanted to show relations different ways, but i thought this way would best way to show relations betweeen variables.  
  
- buggs  
There were many feedbacks about buggs and i fixed them.  


## Resources  
[Jim Vallandingham Blog](http://vallandingham.me/bubble_charts_in_d3.html)  
-This blog has really good tutorial to create animated bubble chart.
