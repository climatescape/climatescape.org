import styled, { css } from "styled-components"
import { Search } from "styled-icons/fa-solid/Search"

export const Root = styled.div`
  position: relative;
  display: grid;
  grid-gap: 1em;
`
export const SearchIcon = styled(Search)`
  width: 1em;
  pointer-events: none;
`
const focus = css`
  background: white;
  color: ${props => props.theme.darkBlue};
  cursor: text;
  width: 5em;
  + ${SearchIcon} {
    color: ${props => props.theme.darkBlue};
    margin: 0.3em;
  }
`
const collapse = css`
  width: 0;
  cursor: pointer;
  color: ${props => props.theme.lightBlue};
  + ${SearchIcon} {
    color: white;
  }
  ${props => props.focus && focus}
  margin-left: ${props => (props.focus ? `-1.6em` : `-1em`)};
  padding-left: ${props => (props.focus ? `1.6em` : `1em`)};
  ::placeholder {
    color: ${props => props.theme.gray};
  }
`
const expand = css`
  background: ${props => props.theme.veryLightGray};
  margin-left: -2em;
  padding-left: 2em;
  + ${SearchIcon} {
    margin: 0.5em;
  }
`
export const Input = styled.input`
  outline: none;
  border: none;
  font-size: 1em;
  background: transparent;
  transition: ${props => props.theme.shortTrans};
  border-radius: ${props => props.theme.smallBorderRadius};
  {highlight-next-line}
  ${props => (props.collapse ? collapse : expand)};
`
export const Form = styled.form`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`
export const HitsWrapper = styled.div`
  display: ${props => (props.show ? `grid` : `none`)};
  z-index: 2;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  right: -20px;
  top: 2.5em;
  width: 80vw;
  max-width: 20em;
  box-shadow: 2px 2px 6px 2px rgba(197, 199, 200, 0.5);
  border: 1px solid #ccc;
  padding: 0.1em 0 0;
  background: white;
  border-radius: 4px;
  li:first-child {
    border-top: none;
  }
  li {
    line-height: 2em;
    border-top: 1px solid #efefef;
    padding-left: 1em;
    text-align: left;
  }
  * {
    margin-top: 0;
    padding: 0;
  }
  ul {
    margin-top: 2px;
    list-style: none;
    overflow-y: scroll;
    max-height: 80vh;
  }
  mark {
    background-color: white;
    font-weight: bold;
  }
`
