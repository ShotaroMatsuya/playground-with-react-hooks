import React,{ useState, useEffect,useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import URL from '../../config';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  //useEffectは全てのrenderingが終了したあとに実行される
  //第2引数になにもセットせずにuseEffectを使うと,componentDidUpdateと同じ働き
  //第2引数に[]をセットすると、componentDidMountと同じ動き
  // useEffect(()=>{
  //   fetch(URL + '/ingredients.json')
  //       .then(response => response.json())
  //       .then(responseData =>{
  //       //firebaseはobjectで帰ってくるのでarrayに変換
  //       const loadedIngredients = [];
  //       for(const key in responseData){
  //         loadedIngredients.push({
  //           id:key,
  //           title:responseData[key].title,
  //           amount:responseData[key].amount
  //         });
  //       }
  //        setUserIngredients(loadedIngredients);
  //       });
  //     },[]);

  //stateをsetするとそのstateが変化したときのみ実行される
  useEffect(()=>{
    console.log('RENDERING INGREDIENTS',userIngredients);
  },[userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients =>{
    setUserIngredients(filteredIngredients);
  },[]);//useCallbackにより関数がcacheされてre-createされないのでinfiniteLoopを防ぐことができる


  const addIngredientHandler = ingredient =>{ //ingredientはobject(amount , title)
    fetch(URL + '/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{ 'Content-Type': 'application/json' }
    }).then(response =>{
      return response.json();
    }).then(responseData =>{
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        {id:responseData.name,...ingredient } 
      ]);
    });
  };
  const removeIngredientHandler = ingredientId => {
    fetch(URL + `/ingredients/${ingredientId}.json`,{
      method:'DELETE'
      }
    ).then(response => {
      setUserIngredients(prevIngredients => prevIngredients.filter((ingredient)=>{
        return ingredient.id !== ingredientId;
      }));
    });
  }
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
