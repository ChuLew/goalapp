import React, { Component } from 'react';
import AppNav from './AppNav';
class Category extends Component {
  state = { 
    isLoading:true, // one you load componenet i have no categories and my page is still loading because i havent fetched any data yet
    Categories : []
   }

   //goal here is to call our java spring boot application
   //synchronous - send request and wait for response
   //asynchrnous - send a request and you dont have to wait
   async componentDidMount(){
      const response = await fetch("/api/categories")
      const body = await response.json();
      this.setState({Categories:body,isLoading:false})
   }

  render() { 
    const {Categories,isLoading} = this.state;
    if (isLoading)
      return(<div>loading...</div>)
    return ( 
        <div>
          <AppNav/>
            <h2>Categories</h2>
            {
              Categories.map(category=> 
                //map does for every member of the list
                // for every single member of the json file we are 
                //looking for the id and assigning the name of that id
                  // as the body of the div
                <div id = {category.id}>
                    {category.name}
                </div>
                  )
            }
        </div> );
  }
}
 
export default Category;
