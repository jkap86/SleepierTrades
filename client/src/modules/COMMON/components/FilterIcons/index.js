import './FilterIcons.css';
import IncludeTaxiFilter from './IncludeTaxiFilter';
import TeamFilter from './TeamFilter';

const FilterIcons = ({type, ...props}) => {

    switch(type) {
        case 'taxi':
            return <IncludeTaxiFilter {...props} />;
        case 'team':
            return <TeamFilter {...props} />;
        default:
            return null;

    }

}

export default FilterIcons;