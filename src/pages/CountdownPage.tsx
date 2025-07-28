import { Outlet } from 'react-router-dom';

function CountdownPage() {

  return (
    <div>
      <section className='section'>
        <div className="container is-fluid">
          <Outlet />
        </div>
      </section>
    </div>
  )
}

export default CountdownPage

