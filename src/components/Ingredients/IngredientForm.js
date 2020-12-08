import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  //useStateの返り値はいつでも２つの要素を含んだarray[currentStateのsnapshot,function of updating current state]
  //useStateはrootLevelでしか使用できない(if statementやcustom function内ではnot allowed!)
  //split multiple state -> best practice
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [buttonState, setButtonValid] = useState(false);
  console.log('RENDERING <IngredientForm /> (using React.memo)');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  useEffect(() => {
    if (enteredTitle === '' || enteredAmount === '') {
      setButtonValid(false);
    } else {
      setButtonValid(true);
    }
  }, [enteredTitle, enteredAmount]);
  const resetHandler = () => {
    setEnteredTitle('');
    setEnteredAmount('');
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">買うもの</label>
            <input
              type="text"
              id="title"
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
            <label htmlFor="amount">量</label>
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
            <button type="submit" disabled={!buttonState}>
              追加
            </button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
        <button className="resetBtn" onClick={resetHandler}>
          リセット
        </button>
      </Card>
    </section>
  );
});

export default IngredientForm;
