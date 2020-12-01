import React,{ useReducer,useEffect,useCallback,useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import URL from '../../config';

//reducer関数はcomponentの外で定義(useReducerは中で使う)
const ingredientReducer = (currentIngredients, action) =>{
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients,action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};
//関連性のあるstateはreducerでまとめて扱うとよし
const httpReducer =(curHttpState,action) =>{
  switch(action.type){
    case 'SEND':
      return {loading:true,error:null};
    case 'RESPONSE':
      return {...curHttpState,loading:false};//oldStateをcloneする必要あり
    case 'ERROR':
      return {loading:false,error:action.errorMessage};
    case 'CLEAR':
      return {...curHttpState,error:null};
    default:
      throw new Error('Should not be reached!');
  }
}

const Ingredients = () => {
  //useReducerの第一引数はreducer関数、第2引数はinitial_state
  const [userIngredients,dispatch] = useReducer(ingredientReducer,[]);
  // const [ userIngredients, setUserIngredients ] = useState([]);
  const [httpState,dispatchHttp] = useReducer(httpReducer,{loading:false,error:null});
  // const [isLoading,setIsLoading] = useState(false);
  // const [error,setError] = useState();

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
    // setUserIngredients(filteredIngredients);
    dispatch({type:'SET',ingredients:filteredIngredients})
  },[]);//useCallbackにより関数がcacheされてre-createされないのでinfiniteLoopを防ぐことができる


  // useCallbackで最初の一回のみbuildされる
  const addIngredientHandler = useCallback(ingredient =>{ 
    //ingredientはobject(amount , title)
    dispatchHttp({type:'SEND'});
    fetch(URL + '/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{ 'Content-Type': 'application/json' }
    }).then(response =>{
      dispatchHttp({type:'RESPONSE'});
      return response.json();
    }).then(responseData =>{
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   {id:responseData.name,...ingredient } 
      // ]);
      dispatch({type:"ADD",ingredient:{id:responseData.name,...ingredient } })
    });
  },[]);
  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({type:'SEND'});
    fetch(URL + `/ingredients/${ingredientId}.json`,{
      method:'DELETE'
      }
    ).then(response => {
      dispatchHttp({type:'RESPONSE'});
      // setUserIngredients(prevIngredients => prevIngredients.filter((ingredient)=>{
      //   return ingredient.id !== ingredientId;
      // }));
      dispatch({type:'DELETE',id:ingredientId})
    }).catch(err=>{
      //同じスコープ(関数)内で複数のsetStateを実行した場合には同期的に処理されてrenderingは一度しか行われないという仕組みになっている
      //ただし、更新されたstateはrenderingがされたあとでのみ使用できるという点に注意
      dispatchHttp({type:'ERROR',errorMessage:'Something went wrong!'});
    });
  },[]);
  const clearError = useCallback(() =>{
    dispatchHttp({type:'CLEAR'});
  },[]);

  const ingredientList = useMemo(()=>{//useMemoはvalueをsaveし、useCallbackはfunctionをsaveする
    return (
      <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={removeIngredientHandler} />
    );
  },[userIngredients,removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm 
        loading={httpState.loading}
        onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
