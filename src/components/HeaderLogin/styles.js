import styled from "styled-components";

export const ContainerHeaderLogin = styled.header`
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

export const ContainerHeaderTitle = styled.div`

  > h1 {
    color: #eee;
    text-align: center;
    width: 210px;

    @media (max-width: 576px) {
      width: 125px;
      font-size: 2rem;
    }
  }
`;

export const ContainerHeaderLoginButton = styled.div`

  > div button {
    margin-bottom: 1rem;
    min-width: 7rem;
  }
`;