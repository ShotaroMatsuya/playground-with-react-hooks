import React from 'react';

import './IngredientList.css';

const IngredientList = props => {
  console.log('RENDERING <IngredientList /> (using useMemo)');
  return (
    <section className="ingredient-list">
      <h2>買うものリスト</h2>
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
