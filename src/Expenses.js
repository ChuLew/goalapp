import React, { Component } from 'react';
import AppNav from './AppNav';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import {Table,Container,Input,Button,Label,Form,FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';
import CanvasJSReact from './assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Expenses extends Component {

    
   emptyItem = {
        description : '' ,
        expensedate : new Date(),
        id:'',
        location : '',
        category : {id:1 , name:'Travel'},
        price : ''
    }
    constructor(props){
        super(props)
  
        this.state = { 
          isLoading :false,
          categories:[],
          Expenses : [],
          date :new Date(),
          item : this.emptyItem,
          price :[]
         }
  
         this.handleSubmit= this.handleSubmit.bind(this);
         this.handleChange= this.handleChange.bind(this);
         this.handleDateChange= this.handleDateChange.bind(this);
         this.handleCatChange = this.handleCatChange.bind(this);
  
      } 


    handleChange(event){
        const target= event.target;
        const value= target.value;
        const name = target.name;
        
        let item={...this.state.item};
        item[name] = value;
        this.setState({item});
        console.log(item);
      }
  
  
      handleDateChange(date){
        let item={...this.state.item};
        item.expensedate= date;
        this.setState({item});
      
      }
      handleCatChange(category) {
        const idx = category.target.selectedIndex; 
        let idex = category.target.selectedIndex;
        let dataset = category.target.options[idex].text;
    
        category = {...this.state.category}
        category.id = idx + 1;
        category.name = dataset;
    
        let item = { ...this.state.item};
        item.category = category
        this.setState({ item });
      }

    async handleSubmit(event){
     
        const item = this.state.item;
      
  
        await fetch(`/api/expenses`, {
          method : 'POST',
          headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify(item),
        });
        
        event.preventDefault();
        this.props.history.push("/expenses");
      }
      
    async remove(id){
        await fetch(`/api/expenses/${id}` , {
          method: 'DELETE' ,
          headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          }

        }).then(() => {
          let updatedExpenses = [...this.state.Expenses].filter(i => i.id !== id);
          this.setState({Expenses : updatedExpenses});
        });

    }

   //event driven programing 
    async componentDidMount(){ // async  means it will update itself we dont have to handle handshake
        const response = await fetch ('/api/categories');
        const body = await response.json();// means when we fetch data and its ready i will let you know when its ready
        this.setState({categories: body, isLoading:false});// always update state wiht setState do no update it direclty

        const responseExp = await fetch('/api/expenses');
        const bodyExp = await responseExp.json();
        this.setState({Expenses : bodyExp,isLoading:false})

        
    }
    render() { 
       
        const title = <h2>Add Expense</h2>;
        const {categories} = this.state;
        const {Expenses,isLoading} = this.state;
        if (isLoading)
             return(<div>loading...</div>)
        let optionList = 
            categories.map(category=>
            <option id = {category.id}>
                {category.name}
            </option>
            )
        let rows=
                Expenses.map( expense =>
                <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>{expense.location}</td>
                    <td><Moment date={expense.expensedate} format="YYYY/MM/DD"/></td>
                    <td>{expense.category.name}</td>
                    <td>{expense.price}</td>
                    <td><Button size="sm" color="danger" onClick={() => this.remove(expense.id)}>Delete</Button></td>
                </tr> )
       
        let sum_value = Expenses.reduce((sum, current)=>{
            return sum + current.price
        }, 0);
        let Grocery = 0;
        let Housing = 0;
        let Enjoyment = 0;
        let Vacation = 0;
        let Transportation = 0;
        for (var i=0; i<Expenses.length; i++) {
          let entry = Expenses[i];
          if (entry.category.name === "Grocery"){
            Grocery+=entry.price;
          }
          if (entry.category.name  === "Housing"){
            Housing+=entry.price;
          }
          if (entry.category.name  === "Enjoyment"){
            Enjoyment+=entry.price;
          }
          if (entry.category.name  === "Vacation"){
            Vacation+=entry.price;
          }
          if (entry.category.name === "Transportation"){
            Transportation+=entry.price;
          }
      }
        
       // need to add proccessing where each of these percentages are calcuated
      
        const options = {
			exportEnabled: true,
			animationEnabled: true,
			title: {
				text: "Expense Percentages"
			},
			data: [{
				type: "pie",
				startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}%",
				dataPoints: [
					{ y: parseInt(100*(Grocery/sum_value)), label: "Grocery/Food" },
					{ y: parseInt(100*(Housing/sum_value)), label: "Housing/Utilities" },
					{ y: parseInt(100*(Enjoyment/sum_value)), label: "Entertainment/Enjoyment" },
					{ y: parseInt(100*(Vacation/sum_value)), label: "Vacation" },
					{ y: parseInt(100*(Transportation/sum_value)), label: "Transportation" }
				]
			}]
		}
        return (
            <div><AppNav/>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            <Container>
                <div className="center">
                <h3>Total Expenses:${sum_value}</h3>
                </div> 
            <Table className = "mt-4">
                <thead>
                    <tr>
                        <th width = "20%">Description</th>
                        <th width = "10%">Location</th>
                        <th width >Date</th>
                        <th width >Category</th>
                        <th width > Price </th>
                        <th width = "10%">Action</th> 
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
            </Container>
            <Container>
                {title}
                <Form onSubmit = {this.handleSubmit}>
                    <FormGroup className = "col-md-4 mb-3">
                        <div className = "sidebyside">
                        <Label for="description">Description of Expense</Label>
                        <Input type = "description" name = "description" id = "description"
                         onChange={this.handleChange} autoComplete = "name"/>
                         </div>
                        <Label for ="location">Location</Label>
                        <Input type="text" name="location" id="location" onChange={this.handleChange}/>
                        <Label for="price">Price</Label>
                        <Input type="number" name="price" id="price" onChange={this.handleChange}/>
                        <Label for="category">Category</Label>
                        <select onChange={this.handleCatChange}>
                                {optionList}
                        </select>
                        <div>
                        <Label for="city">Date</Label>
                        <DatePicker selected={this.state.item.expensedate}  onChange={this.handleDateChange} />
                    
                        </div>
                           </FormGroup>
                   
                    <FormGroup>
                        <Button color = "primary" type = "submit">Save</Button>
                        <Button color = "secondary" tag = {Link} to ="/">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
            </div>
            );
    }
}
 
export default Expenses;