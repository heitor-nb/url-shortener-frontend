import { useEffect, useState } from "react";
import styled from "styled-components";
import { CiLink } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    padding: 0 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .errorMessage {
        position: absolute;
        top: 8rem;
        width: 100%;
        padding: 0 10%;
        font-family: monospace;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.danger};
        text-align: start;
    }

    .headline {
        width: 100%;
        text-align: start;
        font-size: 2rem;
        font-weight: 700;
    }

    .emailFormGroup {
        margin: 2rem 0 0.8rem 0;
    }
`

const Nav = styled.nav`
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 4rem;
    padding: 0 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.textLight};

    .signUpBtn {
        width: 40%;
        height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        border: 1px solid ${({ theme }) => theme.colors.textLight};
        border-radius: 0.4rem;
    }
`

const FormGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 0.5rem;

    label {
        font-size: 0.8rem;
        font-weight: 600;
    }

    input {
        width: 100%;
        height: 3rem;
        padding: 0 5%;
        background: ${({ theme }) => theme.colors.surface};
        border: 1px solid ${({ theme }) => theme.colors.textLight};
        border-radius: 0.5rem;
        text-align: start;
    }

    input:focus {
        border-color: dodgerblue;
    }
`

const SubmitBtn = styled.div`
    margin-top: 2.1rem;
    width: 100%;
    height: 3.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 0.5rem;
    color: ${({ theme }) => theme.colors.surface};
    font-size: 1.1rem;
    font-weight: 700;
`

function SignIn(){
    const { demo } = useParams();
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if(demo){
            const demoEmail = import.meta.env.VITE_DEMO_EMAIL;
            const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;
            
            setEmail(demoEmail);
            setPassword(demoPassword);
        }
    }, []);

    async function handleSubmit(){
        if(isFetching) return;

        setIsFetching(true);

        const apiUrl = import.meta.env.VITE_API_URL;
        const postData = {
            email,
            password
        };

        try {
            var response = await fetch(`${apiUrl}/Auth/SignIn`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData)
            });
            
            if(response.ok){
                navigate("/dashboard");
                return;
            }
            
            var data = await response.json();
            setErrorMessage(data.message);
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Sign in failed. Please try again.");   
        } finally {
            setTimeout(() => setErrorMessage(""), 5000);
            setIsFetching(false);
        }
    }

    return <Container>
        <Nav>
            <CiLink size={"2rem"} onClick={() => navigate("/")}/>
            <div className="signUpBtn" onClick={() => navigate("/sign-up")}>Sign up</div>
        </Nav>

        <h1 className="headline">Sign in.</h1>

        {true && <p className="errorMessage">{errorMessage}</p>}

        <FormGroup className="emailFormGroup">
            <label htmlFor="email">Email</label>
            <input 
                type="email" 
                id="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Type your email address"
                disabled={isFetching}
            />
        </FormGroup>
        <FormGroup>
            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                id="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Type your password"
                disabled={isFetching}
            />
        </FormGroup>
        <SubmitBtn onClick={handleSubmit}>Continue</SubmitBtn>
    </Container>
}

export default SignIn;