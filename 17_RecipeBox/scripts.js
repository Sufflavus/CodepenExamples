(function(){ 
  //https://reactjsnews.com/modals-in-react
  //http://stackoverflow.com/questions/28241912/bootstrap-modal-in-react-js
  
  var Modal = React.createClass({
    render: function() {
      return (
        <div id="modal1" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4>Add a Recipe</h4>
            <div className="row">
              <div className="input-field col s12">
                <input id="name" type="text" className="validate"/>
                <label for="name">Recipe Name</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">  
                <input placeholder="Enter Ingredients,Separated,By Commas" id="ingredients" type="text" className="validate"/>
                  <label for="ingredients">Ingredients</label>         
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-light btn blue-grey lighten-3">Close</a>
            <a href="#!" className="modal-action modal-close waves-effect waves-light btn">Add Recipe</a>
          </div>
        </div>
      );
    }
  });
  
  var IngredientListItem = React.createClass({
    render: function() {
      return (
        <li className="collection-item">
          {this.props.name}
        </li>
      );
    }
  });
  
  var IngredientList = React.createClass({
    getInitialState: function() {
      var ingredients = this.props.ingredients.map(function(item){
        return (
          <IngredientListItem name={item}/>
        );               
      });
      return { 
        ingredients: ingredients
      };
    },
    render: function() {
      return (
        <ul className="collection with-header">
          <li className="collection-header">
            Ingredients
          </li>
          {this.state.ingredients}
        </ul>
      );
    }
  });  
  
  var Recipe = React.createClass({
    render: function() {
      return (
        <li>
          <div className="collapsible-header">{this.props.recipe.name}</div>
          <div className="collapsible-body">
            <IngredientList ingredients={this.props.recipe.ingredients}/>           
            <div>
              <a className="waves-effect waves-light btn"><i className="material-icons left">mode_edit</i>Edit</a>
              <a className="waves-effect waves-light btn red"><i className="material-icons left">delete</i>Delete</a>
            </div>
          </div>
        </li>
      );
    }
  });
  
  var RecipeList = React.createClass({
    getInitialState: function() {
      var res = [{
        name: "recipe1",
        ingredients: ["ingredient1", "ingredient2"]
      }, {
        name: "recipe2",
        ingredients: ["ingredient1", "ingredient2"]
      }];
      var recipes = res.map(function(item){
        return (
          <Recipe recipe={item}/>
        );               
      });
      return { 
        recipes: recipes,
        isModelVisible: false
      };
    },       
    render: function(){
      return (
        <div>
          <div>
            <a className="waves-effect waves-light btn modal-trigger" href="#modal1"><i className="material-icons left">add</i>Add Recipe</a>
            <ul className="collapsible" data-collapsible="accordion">
              {this.state.recipes}
            </ul>
          </div>
          <Modal />
        </div>
      );
    }
  });
  
  ReactDOM.render(
    <RecipeList />,
    document.getElementById('container')
  );  
  
  $('.modal-trigger').leanModal();
})();