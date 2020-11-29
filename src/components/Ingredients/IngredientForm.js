import React,{ useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  //useStateの返り値はいつでも２つの要素を含んだarray[currentStateのsnapshot,function of updating current state]
  //useStateはrootLevelでしか使用できない(if statementやcustom function内ではnot allowed!)
  //split multiple state -> best practice
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  
  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title:enteredTitle,amount:enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" 
              value={enteredTitle}
              onChange={event => {
                setEnteredTitle(event.target.value);
              }}
                // 直前のstateを反映するにはcallbackの引数で取得する(setStateと同じ)
              // onChange={event => inputState[1]({title:event.target.value})}
            //  引数には更新したいstateとしないstateもすべてセットする(setStateのようにmargeしてくれないので注意) 
              
              />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount" 
              value={enteredAmount}
              onChange={event => {
                setEnteredAmount(event.target.value);  
              }}
                />
              
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
