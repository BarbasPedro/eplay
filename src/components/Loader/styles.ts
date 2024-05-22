import styled from 'styled-components'
import { colors } from '../../styles'

export const Pacman = styled.div`
  margin: 0;
  background: ${colors.black};
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .loader {
    position: relative;
    height: 60px;
    width: 160px;
  }

  .circles {
    position: absolute;
    left: 60px;
    top: 0;
    height: 60px;
    width: 100px;
    animation: moveCircles 0.3s infinite linear;
  }

  .circles span {
    position: absolute;
    top: 25px;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: #efefef;
  }

  .circles span.one {
    right: 60px;
  }

  .circles span.two {
    right: 30px;
  }

  .circles span.three {
    right: 0;
  }

  @keyframes moveCircles {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-30px);
    }
  }

  .pacman {
    position: absolute;
    left: 0;
    top: 0;
    height: 60px;
    width: 60px;
  }

  .pacman .eye {
    position: absolute;
    top: 10px;
    left: 30px;
    height: 7px;
    width: 7px;
    border-radius: 50%;
    background-color: ${colors.black};
  }

  .pacman span {
    position: absolute;
    top: 0;
    left: 0;
    height: 60px;
    width: 60px;
  }

  .pacman span::before {
    content: '';
    position: absolute;
    left: 0;
    height: 30px;
    width: 60px;
    background-color: #fffb16;
  }

  .pacman .top::before {
    top: 0;
    border-radius: 60px 60px 0 0;
  }

  .pacman .bottom::before {
    bottom: 0;
    border-radius: 0 0 60px 60px;
  }

  .pacman .left::before {
    bottom: 0;
    height: 60px;
    width: 30px;
    border-radius: 60px 0 0 60px;
  }

  .pacman .top {
    animation: topAnim 0.3s infinite;
  }

  @keyframes topAnim {
    0%,
    100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-45deg);
    }
  }

  .pacman .bottom {
    animation: bottomAnim 0.3s infinite;
  }

  @keyframes bottomAnim {
    0%,
    100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(45deg);
    }
  }
`
