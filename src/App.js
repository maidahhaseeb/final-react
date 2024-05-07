import React, { Component } from "react";
import "./App.css";
import Child1 from "./components/Child1";
import Child2 from "./components/Child2";
import * as d3 from "d3";
import SampleDataset from "./SampleDataset.csv";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedCategory: 'A',
      
    };
  }


  componentDidMount() {
    var self=this
    d3.csv(SampleDataset,function(d){
      return{
        x: parseInt(d.x),
        y: parseInt(d.y), 
        category: d.category
      }
    }).then(function(csv_data){

      self.setState({data: csv_data});
      console.log(csv_data)      
    })
    .catch(function(err){
      console.log(err)
    })
  }
    render(){
      console.log("render is called")
      return <div className="parent">

        <div className="container">
          <div className="bar-chart">
          <Child1 data = {this.state.data}/>
          </div>
          <div className="scatterPlot-container">
            <Child2 data={this.state.data}/>
          </div>
        </div>  
      </div>;
    }

  }

export default App;