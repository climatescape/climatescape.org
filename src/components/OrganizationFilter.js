import React, {useState} from "react"
import { OrganizationTag, OrganizationLocation, OrganizationHeadcount, OrganizationOrgType } from "../components/OrganizationAttributes"

export const useOrganizationFilterState = () => {
    const [byTag, setTagFilter] = useState(null);
    const [byLocation, setLocationFilter] = useState(null);
    const [byHeadcount, setHeadcountFilter] = useState(null);
    const [byOrgType, setOrgTypeFilter] = useState(null);
  
    const setFilter = { 
      byTag: setTagFilter,
      byLocation: setLocationFilter,
      byHeadcount: setHeadcountFilter,
      byOrgType: setOrgTypeFilter,
      none: () => {
        setTagFilter(null);
        setLocationFilter(null);
        setHeadcountFilter(null);
        setOrgTypeFilter(null);
      }
    };

    const applyFilter = organizations => {
        if (byTag)
            organizations = organizations.filter(org => org.tags && org.tags.indexOf(byTag) >= 0);
    
        if (byLocation)
            organizations = organizations.filter(org => org.location === byLocation);

        if (byHeadcount)
            organizations = organizations.filter(org => org.headcount === byHeadcount);

        if (byOrgType)
            organizations = organizations.filter(org => org.orgType === byOrgType);
        return organizations;
    }

    return [{byTag, byLocation, byHeadcount, byOrgType }, setFilter, applyFilter];
  }
  
const OrganizationFilter = ({currentFilter, onClearFilter}) => {
    const {byTag, byLocation, byHeadcount, byOrgType } = currentFilter;
    const hasFilterApplied = (byTag || byLocation || byHeadcount || byOrgType) ;
    return (<>
    { hasFilterApplied && <p className="p-3 text-gray-700 bg-gray-100 border-b border-gray-400 text-sm">
    <span className="mr-2">Filtered by</span>
    { byTag && 
      <OrganizationTag active={true} text={byTag} />
    }
    { byLocation &&
      <OrganizationLocation active={true} text={byLocation} />
    }
    { byHeadcount &&
      <OrganizationHeadcount active={true} text={byHeadcount} />
    }
    { byOrgType &&
    <OrganizationOrgType active={true} text={byOrgType} />
    }
    <button
      onClick={e => onClearFilter()}
      className="underline hover:no-underline ml-1"
    >clear</button></p>
    }</>);
}

export default OrganizationFilter
