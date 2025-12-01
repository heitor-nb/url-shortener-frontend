import { useEffect } from "react";
import styled from "styled-components"
import { CiLink } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    padding: 0 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .headline {
        font-family: ${({ theme }) => theme.fonts.heading};
        font-size: 2.2rem;
    }

    .headline, .subheadline {
        width: 100%;
        text-align: start;
    }

    .subheadline {
        margin: 0.5rem 0 3rem 0;
    }

    .or {
        margin: 0.5rem 0;
        font-size: 0.8rem;
        font-style: italic;
    }

    .signUp {
        background: ${({ theme }) => theme.colors.secondary};
        border: none;
        color: ${({ theme }) => theme.colors.surface};
    }
`

const Btn = styled.div`
    width: 100%;
    height: 3rem;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.textLight};
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    cursor: pointer;
`

const DemoSection = styled.div`
    position: absolute;
    bottom: 1rem;
    width: 80%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    .info {
        font-style: italic;
    }

    .demoBtn {
        width: 50%;
    }
`

function Home(){
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/Auth/RefreshTokens`, {
            method: "POST",
            credentials: "include"
        })
        .then(response => { if(response.ok) navigate("/dashboard") })
        .catch(error => console.error("Error:", error));
    }, []);

    return (
        <Container>
            <h1 className="headline">URL<CiLink /><br />Shortener</h1>
            <p className="subheadline">Fewer characters. <b>Bigger impact.</b></p>
            <Btn onClick={() => navigate("/sign-in")}>Sign in</Btn>
            <p className="or">- or -</p>
            <Btn className="signUp" onClick={() => navigate("/sign-up")}>Sign up for free</Btn>
            <DemoSection>
                <p className="info">Are you a recruiter?</p>
                <Btn className="demoBtn" onClick={() => navigate("/sign-in/demo")}>Use demo credentials</Btn>
            </DemoSection>
        </Container>
    )
}

export default Home;
