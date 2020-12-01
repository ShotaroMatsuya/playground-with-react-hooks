import {useReducer, useCallback} from 'react';

//関連性のあるstateはreducerでまとめて扱うとよし
const httpReducer =(curHttpState,action) =>{
    switch(action.type){
      case 'SEND':
        return {
            loading:true,
            error:null,
            data:null,
            extra:null,
            identifier:action.identifier
        };
      case 'RESPONSE':
        return {...curHttpState,loading:false,data:action.responseData,extra:action.extra};//oldStateをcloneする必要あり
      case 'ERROR':
        return {loading:false,error:action.errorMessage};
      case 'CLEAR':
        return {...curHttpState,error:null};
      default:
        throw new Error('Should not be reached!');
    }
  };

//custom hook principle... not sharing state ,but sharing logic
const useHttp = () =>{
    const [httpState,dispatchHttp] = useReducer(httpReducer,{
        loading:false,
        error:null,
        data:null,//fetchしたresponseData
        extra:null,
        identifier:null
    });

    const sendRequest = useCallback((url,method,body,reqExtra,reqIdentifier) =>{
        dispatchHttp({type:'SEND',identifier:reqIdentifier});
        fetch(url,{
            method:method,
            body:body,
            headers:{'Content-Type':'application/json'}
            }
          ).then(response =>{
              return response.json();
          })
          .then(responseData => {
            dispatchHttp({type:'RESPONSE',responseData:responseData,extra:reqExtra});
            
          }).catch(err=>{
            //同じスコープ(関数)内で複数のsetStateを実行した場合には同期的に処理されてrenderingは一度しか行われないという仕組みになっている
            //ただし、更新されたstateはrenderingがされたあとでのみ使用できるという点に注意
            dispatchHttp({type:'ERROR',errorMessage:'Something went wrong!'});
          });
    },[]);
    return {
        isLoading:httpState.loading,
        data:httpState.data,//responseData from firebase
        error:httpState.error,
        sendRequest:sendRequest,
        reqExtra:httpState.extra,//ingredient オブジェクト
        reqIdentifier:httpState.identifier//action type名
    };
};

export default useHttp;