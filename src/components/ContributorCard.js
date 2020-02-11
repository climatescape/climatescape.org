import React from "react"
import Img from "gatsby-image"

const ContributorCard = ({ name, contributions, avatar, website }) => (
    <a href={website} className="flex p-3 my-2 rounded bg-white w-15">
        <Img className="w-10 h-10 m-1 rounded" fluid={avatar}/>
        <div> 
            <div>{name}</div>
            <div className="text-gray-600">{contributions}</div>
        </div>
    </a>
)

export default ContributorCard
