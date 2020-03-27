import styled, { css } from "styled-components"

export const Root = styled.div`
  position: relative;
  display: grid;
  grid-gap: 1em;
`

const focus = css`
  background: white;
  color: ${props => props.theme.darkBlue};
  cursor: text;
  width: 5em;
`
const collapse = css`
  width: 0;
  cursor: pointer;
  color: ${props => props.theme.lightBlue};

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
`
export const Input = styled.input`
  outline: none;
  border: none;
  font-size: 1em;
  background: transparent;
  {highlight-next-line}
  ${props => (props.collapse ? collapse : expand)};
`

export const HitsWrapper = styled.div``
