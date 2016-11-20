'use strict'

const Database = use('Database')
const Category = use('App/Model/Category')
const Recipe = use('App/Model/Recipe')
const Validator = use('Validator')

class RecipeController {

  * index(request, response) {
    // const categories = yield Database.from('categories').select('*');
    // response.send(categories)

    const categories = yield Category.all()

    for(let category of categories) {
      const recipes = yield category.recipes().limit(3).fetch();
      category.topRecipes = recipes.toJSON();
    }

    yield response.sendView('main', {
      name: '',
      categories: categories.toJSON()
    })  
  }

  * create (request, response) {
    const categories = yield Category.all()
    yield response.sendView('recipeCreate', {
      categories: categories.toJSON()
    });
  }

  * doCreate (request, response) {
    const recipeData = request.except('_csrf');

    const rules = {
      name: 'required',
      ingredients: 'required',
      instructions: 'required',
      category_id: 'required'
    };

    const validation = yield Validator.validateAll(recipeData, rules)

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      response.redirect('back')
      return
    }

    recipeData.user_id = request.currentUser.id
    const recipe = yield Recipe.create(recipeData)
    // response.send(recipe.toJSON())
    response.redirect('/')
  }

  * edit (request, response) {
    const categories = yield Category.all()
    const id = request.param('id');
    const recipe = yield Recipe.find(id);
    // console.log(recipe.toJSON())

    if (request.currentUser.id !== recipe.user_id) {
      response.unauthorized('Access denied.')
      return
    }


    yield response.sendView('recipeEdit', {
      categories: categories.toJSON(),
      recipe: recipe.toJSON()
    });
  }

  * doEdit (request, response) {
    const recipeData = request.except('_csrf');

    const rules = {
      name: 'required',
      ingredients: 'required',
      instructions: 'required',
      category_id: 'required'
    };

    const validation = yield Validator.validateAll(recipeData, rules)

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      response.redirect('back')
      return
    }

    const id = request.param('id');
    const recipe = yield Recipe.find(id);

    // Object.assign(recipe, recipeData)
    
    recipe.name = recipeData.name;
    recipe.ingredients = recipeData.ingredients; 
    recipe.instructions = recipeData.instructions;
    recipe.category_id = recipeData.category_id;

    yield recipe.save()
    
    response.redirect('/')
  }

  * show (request, response) {
    const id = request.param('id');
    const recipe = yield Recipe.find(id);
    yield recipe.related('category').load();
    // response.send(recipe.toJSON())

    yield response.sendView('recipeShow', {
      recipe: recipe.toJSON()
    })
  }

  * doDelete (request, response) {
    const id = request.param('id');
    const recipe = yield Recipe.find(id);

    if (request.currentUser.id !== recipe.user_id) {
      response.unauthorized('Access denied.')
      return
    }

    yield recipe.delete()
    response.redirect('/')
  }
  
}

module.exports = RecipeController
