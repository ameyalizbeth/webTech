import React, {useState} from 'react'


const Landing = () => {
  const [wobble, setWobble] = useState(0)
  return (
    <div className="login-main">
        {/* <button onClick={() => setWobble(1)}>Click me</button> */}
        <div class="container log-disp">
            <div className="log-title">
                <h3>askCET</h3>
                <p>
                    Ask anything and everything to find the best answers to your<br/>
                    never ending doubts regarding our prestigious college. ;)
                </p>
            </div>
                <button className="btn-style" 
                    onClick={() =>{
                        if(wobble===0){
                            setWobble(1);
                        }else if(wobble===1){
                            setWobble(0);
                        }}}    
                    wobble={wobble}>
                    Get Started
                </button>
            
                
            
            
            <div class="box">
                <div className='mx-auto py-4 log-box-main'>
                        <div className="wlcm py-2">
                            <div>Welcome Back</div>
                            <p>Doesn’t have an account? Sign up</p>
                            <button className="btn-close"
                                onClick={() => setWobble(0)}
                                wobble={wobble}>X</button>
                        </div>
                        <form
                            className='mx-auto form-group col-10'
                            // onSubmit={login}
                        >
                            <div className='py-2'>
                                <input
                                    className='form-control px-3 mb-4'
                                    type='text'
                                    placeholder='Username'
                                    name='username'
                                    required
                                    onChange={(e) => {
                                        // setUsername(e.target.value);
                                    }}
                                ></input>
                                <input
                                    className='form-control px-3 mt-4'
                                    type='password'
                                    placeholder='Password'
                                    name='password'
                                    required
                                    onChange={(e) => {
                                        // setPassword(e.target.value);
                                    }}
                                ></input>
                            </div>
                            <div className='my-2'>
                                <button
                                    className='btn mx-auto start-btn d-block col-6'
                                    type='submit'
                                >
                                    Sign in
                                </button>
                                <p
                                    style={{
                                        color: "red",
                                        textAlign: "center",
                                        fontSize: 12,
                                    }}
                                >
                                    {/* {message} */}
                                </p>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
        {/* <img
            className="image"
            src="https://source.unsplash.com/random/400x200"
            alt="randomised!"
            
            onAnimationEnd={() => setWobble(0)}
            wobble={wobble}
        /> */}
    </div>
  )
}
export default Landing

