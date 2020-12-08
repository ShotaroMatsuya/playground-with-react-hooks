import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import URL from '../../config';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  //return に関数を記述することでmain function実行後に毎回実行されるcleanUp関数を定義できる
  //dependenciesとして[]を指定していた場合(componentDidMount)、cleanUp関数はcomponentUnmount時に一度だけ実行される

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        //左辺は500ms後のvalue,右辺はcurrent value
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(URL + '/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            // firebaseはobjectで帰ってくるのでarrayに変換
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            // props.onLoadIngredients(loadedIngredients);//propsをdependencyにregisterしていないと、このメソッドが走ってくれない
            onLoadIngredients(loadedIngredients);
            //custom functionをdependencyにセットする際には定義しているところでuseCallbackを使わないとinfiniteLoopになる
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>タイトル検索</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
