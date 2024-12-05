
import Mealitem from "./Mealitem";
import useHttp from "../hooks/useHttp";

 const requestConfig={};

export default function Meals(){
    const {
        data:loadedMeals,
        isloading,
        error,
    }=useHttp('http://localhost:3000/meals',requestConfig,[]);
     
     if(isloading){
        return <p className="centre">fetching meals..</p>
     }
     if(error){
        return <Error title="Failed to fecth the meals" message={error}/>
     }

     
    return (
    <ul id="meals">{loadedMeals.map(meal=>(
        <Mealitem key={meal.id} meal={meal}/>
    ))}</ul>
    )
}