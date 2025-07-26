import React, { useState, type FormEvent } from 'react'
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import { useAppSelector } from '../store/reducers/store';
import Greeting from '../components/Greeting';
import { sayFarewell } from '../utility/functions';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const [farewell, setFarewell] = useState("");
  const { isLoggedIn } = useSignedInAuthorize();

  const contents = useAppSelector((state) => {
    return state.data.contents;
  });

  const onHandleGreet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFarewell(sayFarewell(contents[0]));
  };

  return (
    <section className='section'>
      <div className="container is-fluid">
        <form onSubmit={onHandleGreet}>

          <div className="field is-grouped">
            <div className="control">
              <Button primary type="submit">Greet</Button>
            </div>
          </div>

          <div className='block'>
            {isLoggedIn && <Greeting name={`${contents}`} />}
            <p>{farewell}</p>
          </div>
        </form>
      </div>
    </section>
  )
}

export default HomePage

