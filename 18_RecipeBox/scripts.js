(function(){ 
  
  class LocalStorageHelper {     
    constructor() {
      this.storageKey = "myRecipes";
      this.defaultRecipes = [{
        "name": "Pumpkin Pie",
        "ingredients": ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"]},{
        "name": "Spaghetti",
        "ingredients": ["Noodles", "Tomato Sauce", "(Optional) Meatballs"]},{
        "name": "Onion Pie",
        "ingredients": ["Onion","Pie Crust","Sounds Yummy right?"]
      }];

      if(!localStorage.getItem(this.storageKey)) {        
        localStorage.setItem(this.storageKey, JSON.stringify(this.defaultRecipes));
      }
    }

    get recipes() {
      return JSON.parse(localStorage.getItem(this.storageKey));
    }

    set recipes(value) {
      localStorage.setItem(this.storageKey, JSON.stringify(value));
    }
    
    getRecipeByName(recipeName) {
      var parsedRecipes = this.recipes;
      for (var i = 0, length = parsedRecipes.length; i < length; i++){
        if (parsedRecipes[i].name === recipeName) {
          return parsedRecipes[i];          
        }
      }  
      return null;
    }   
    
    removeRecipeByName(recipeName) {
      var parsedRecipes = this.recipes;
      for (var i = 0, length = parsedRecipes.length; i < length; i++){
        if (parsedRecipes[i].name === recipeName) {
          parsedRecipes.splice(i, 1);   
          break;
        }
      }  
      this.recipes = parsedRecipes;
    }    
  } 
  
  var Modal = React.createClass({
    getInitialState: function() {
      return {
        name: "", 
        ingredients: ""
      };
    },    
    handleNameChange: function(e) {
      this.props.recipe.name = e.target.value;
      this.setState({ name: e.target.value });      
    },
    handleIngredientsChange: function(e) {
      this.props.recipe.ingredients = e.target.value;
      this.setState({ ingredients: e.target.value });
    },
    handleSaveClick: function() {          
      var name = this.props.recipe.name.length ? this.props.recipe.name : "Untitled";
      var ingredients = this.props.recipe.ingredients.length ? this.props.recipe.ingredients.split(",") : [];
      
      var recipe = {
        initialName: this.props.recipe.initialName,
        name: name,
        ingredients: ingredients
      };        
      this.props.onSaveClick(recipe);      
    },    
    render: function() {
      return (
        <div id="modal1" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4>{this.props.header}</h4>
            <div className="row">
              <div className="input-field col s12">
                <input 
                  type="text"                   
                  value={this.props.recipe.name}
                  onChange={this.handleNameChange}/>
                <label for="name" 
                  className={ this.props.recipe.name.length ? "active" : "dummy" }>
                  Recipe Name
                </label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">  
                <input 
                  placeholder="Enter Ingredients,Separated,By Commas" id="ingredients" 
                  type="text"                   
                  value={this.props.recipe.ingredients}
                  onChange={this.handleIngredientsChange}/>
                  <label for="ingredients" className="active">Ingredients</label>         
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-light btn blue-grey lighten-3">Close</a>
            <a href="#!" className="modal-action modal-close waves-effect waves-light btn" onClick={this.handleSaveClick}>{this.props.saveButtonName}</a>
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
    render: function() {
      var ingredients = this.props.ingredients.map(function(item) {
        return (
          <IngredientListItem name={item}/>
        );  
      });
      
      return (
        <ul className="collection with-header">
          <li className="collection-header">
            Ingredients
          </li>
          {ingredients}
        </ul>
      );
    }
  });  
  
  var Recipe = React.createClass({
    handleDeleteClick: function() {
      this.props.onDeleteClick(this.props.recipe.name);
    },
    handleEditClick: function() {
      this.props.onEditClick(this.props.recipe.name);
    },
    render: function() {
      return (
        <li>
          <div className="collapsible-header teal-text">{this.props.recipe.name}</div>
          <div className="collapsible-body">
            <IngredientList ingredients={this.props.recipe.ingredients}/>           
            <div>
              <a className="waves-effect waves-light btn modal-trigger" href="#modal1"
                onClick={this.handleEditClick}>
                <i className="material-icons left">mode_edit</i>Edit
              </a>
              <a className="waves-effect waves-light btn red"
                onClick={this.handleDeleteClick}>
                <i className="material-icons left">delete</i>Delete
              </a>
            </div>
          </div>
        </li>
      );
    }
  });
  
  var RecipeList = React.createClass({
    getInitialState: function() {  
      var modal = {
        recipe: { name: "", ingredients: [] },
        header: "Add Recipe",
        saveButtonName: "Add Recipe"
      };
      return { 
        recipes: [],
        modal: modal,
        storageHelper: new LocalStorageHelper()
      };
    },  
    componentDidMount: function() {      
      this.loadRecipes();        
    },     
    componentDidUpdate: function() {      
      $('.modal-trigger').leanModal();
    },
    loadRecipes: function() {
      var recipes = this.state.storageHelper.recipes;      
      this.initRecipes(recipes);
    },
    createRecipeElement: function(recipe) {
      return (
        <Recipe recipe={recipe} 
          onDeleteClick={this.handleDeleteRecipeClick}
          onEditClick={this.handleEditRecipeClick}/>
      ); 
    },
    initRecipes: function(recipes) {
      var recipesElements = recipes.map(this.createRecipeElement);
      this.setState({recipes: recipesElements});      
    },     
    handleSaveRecipeClick: function(recipe) {         
      var recipes = this.state.storageHelper.recipes; 
      
      var existingRecipe = null;
      for (var i = 0, length = recipes.length; i < length; i++){
        if (recipes[i].name === recipe.initialName) {
          existingRecipe = recipes[i];       
          break;
        }
      }  
      
      if(existingRecipe) {
        existingRecipe.name = recipe.name;
        existingRecipe.ingredients = recipe.ingredients;
      } else {
        recipe.initialName = null;    
        recipes.push(recipe);
      }     
            
      this.state.storageHelper.recipes = recipes;      
      this.initRecipes(recipes);         
    },    
    handleDeleteRecipeClick: function(recipeName) {
      this.state.storageHelper.removeRecipeByName(recipeName);
      var recipes = this.state.storageHelper.recipes;       
      this.initRecipes(recipes);
    },  
    handleEditRecipeClick: function(recipeName) { 
      var recipe = this.state.storageHelper.getRecipeByName(recipeName);       
      var modal = {
        recipe: {
          name: recipe.name,
          initialName: recipe.name,
          ingredients: recipe.ingredients.join(",")
        },
        header: "Edit Recipe",
        saveButtonName: "Save Recipe"
      };      
      this.setState({ modal: modal });            
    }, 
    handleAddRecipeClick: function() {
      var modal = {
        recipe: { name: "", ingredients: "" },
        header: "Add Recipe",
        saveButtonName: "Add Recipe"
      };
                  
      this.setState({modal: modal});      
    },
    render: function() {      
      return (
        <div>
          <div>
            <a className="waves-effect waves-light btn modal-trigger" href="#modal1"
              onClick={this.handleAddRecipeClick}>
              <i className="material-icons left">add</i>Add Recipe
            </a>
            <ul className="collapsible" data-collapsible="accordion">
              {this.state.recipes}
            </ul>
          </div>
          <Modal 
            onSaveClick={this.handleSaveRecipeClick} 
            recipe={this.state.modal.recipe}
            header={this.state.modal.header}
            saveButtonName={this.state.modal.saveButtonName}/>
        </div>
      );
    }
  });
  
  ReactDOM.render(
    <RecipeList />,
    document.getElementById('container')
  );    
})();