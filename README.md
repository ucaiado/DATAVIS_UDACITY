How Important Is The Time Spent Studying Out Of School
--------------------------

###Abstract
I am going to create an explanatory data visualization from [PISA](http://www.oecd.org/pisa/home/) dataset using java script, D3.js library and html. This project is  connected to the <a href="https://udacity.com/course/ud120-nd">Data Visualization and D3.js</a> course, from Udacity. You can check the visualizations [here](http://ucaiado.github.io/DATAVIS_UDACITY/). 

###The data set
 PISA is a worldwide study developed by the Organisation for Economic Co-operation and Development (OECD) which examines the skills of 15-year-old school students around the world. 
 The study assesses students’ mathematics, science, and reading skills and contains a wealth of information on students’ background, their school and the organisation of education systems. For most countries, the sample is around 5,000 students, but in some countries the number is even higher. In total, the PISA 2012 dataset contains data on 485,490 pupils.

###Summary
I expect that the user see that there is some relationship between the time studied out of school and the math score. Also, I would like that people notice that impact of time studied is even bigger when the social status is smaller.
I changed my mind several times about what to explore in the PISA dataset even before start to code, as can be seen in the [first](https://github.com/ucaiado/DATAVIS_UDACITY/blob/gh-pages/data/first_draft.pdf) and [second](https://github.com/ucaiado/DATAVIS_UDACITY/blob/gh-pages/data/another_draft.pdf) scratch that I have done.
Then, after reading different sources, I guessed that would be nice if I compared the data about how long I studied to the Nanodegree and the time that people usually to study at their homes.
[Iterating](https://github.com/ucaiado/DATAVIS_UDACITY/blob/gh-pages/report_aux.ipynb) over the data, I decided to explore just three variables from the dataset:
- __PV1MATH__: Math Score. "Plausible value 1 in mathematics"
- __ESCS__: Social Status. "Index of economic, social and cultural status"
- __ST57Q01__: "Out-of-School Study Time - Homework
I also crossed the countries names with a [list](https://en.wikipedia.org/wiki/List_of_sovereign_states_and_dependent_territories_by_continent) of continents that I have found in Wikipedia.
To make the visualization lighter, I pre-processed the data using Python and summarized all information that I wanted about almost 500,000 pupils in less than 2,000 lines.


###Design
I made four charts to display all information I desired. To help me explain how all of them are connected, I divided the visualization page in tabs with a button "NEXT" and I included some text on each step to keep my narrative clear.
The first change I have made based on feedback was the disposition of the dashboard of OECD data. Initially, I organized the charts in two rows with the second row divided into two columns. I have changed to two columns and the second column I divided in two rows. It gave me more space to include the explanations in each step. I adopted a kind of purple to fill all my charts where there weren't information to be encoded as color.

__Hours Studied at Udacity__
I made a basic bar chart with the time I studied until August to the Udacity Nanodegree, grouped by week. I included a hoover behaviour in each bar just to help see where they are in the X axis.  

| Variable        | Encoding  |
| ------------- | -----:|
| Hours Studied per week       | Y |
| Week/Date      | X |

__Math-score by time studied out-of-school__
It was the hardest visualization in this project. I made a box plot to display how the Math Score from OECD dataset is distributed over different time studied (per week) buckets. I decided to use a boxplot for this data because there are too much data points in the original dataset and I needed to summarize them.

| Variable        | Encoding  |
| ------------- | -----:|
| Hours Studied out of school per week (buckets)       | X |
| Math Score      | Y |
| Median and whiskers values      | labels |


__Number of Pupils by Social Status Index__
I used this chart to show how the dataset is distributed and also to filter out data based on the social index buckets selected. The user can interact with it to explore the information in the other charts.

| Variable        | Encoding  |
| ------------- | -----:|
| Number of pupils       | Y |
| Index of economic, social and cultural status buckets      | X |

__Average Math Scores by Country vs. Out-of-School Study Time__
In this chart, the user can check more information about each datapoint mousing over the chart. I used a scatter plot here to show the relationship between the two variables enconded here.

| Variable        | Encoding  |
| ------------- | -----:|
| Hours Studied per week       | X |
| Math Score      | Y |
| Math Score,Hours Studied, Continent and Countries names      |   tooltip |
| Continent |    Color Hue |



###Feedback
The __first feedback__ that I received wasn't exactly a formal feedback. I was working on the visualization, and my friend looked at my screen and suggested that I should change the disposition of my charts on the screen, even before I explain what I was doing. Then, I [tested](https://github.com/ucaiado/DATAVIS_UDACITY/commit/0f16b38f9ac302327bb76e0b5b6217d46fbf70df)  some different dispositions, and I ended up really changing what I was doing.





###Resources 

- [Project Rubric](https://docs.google.com/document/d/1zRVs73M7P5ACKB0n3Di4k0AskId3pc6lIpMBmmydETk/pub)
- [PISA Data Visualisation Contest](http://beta.icm.edu.pl/PISAcontest/)
- [interesting relationships in this dataset](https://books.google.com.br/books?id=0g9GAgAAQBAJ&pg=PA12&lpg=PA12&dq=pisa+2012+interesting+relationships&source=bl&ots=JP_IPR4DXD&sig=dAD56SUm0Kg1zG3adLqWgZX2h8Q&hl=en&sa=X&ved=0CDwQ6AEwBmoVChMIrMKt0JGHxwIVRI-QCh2FNAm-#v=onepage&q&f=false)
- [I would like to do something like that](http://www.nytimes.com/interactive/2012/05/17/business/dealbook/how-the-facebook-offering-compares.html?_r=0)
- [filtering ordinal scale](https://stackoverflow.com/questions/20758373/inversion-with-ordinal-scale/20766269#20766269)
- [a box-plot in D3](http://bl.ocks.org/mbostock/4061502)
- [trend-line in D3](http://bl.ocks.org/benvandyke/8459843)
- [visual enconding](http://www.targetprocess.com/articles/visual-encoding.html)

