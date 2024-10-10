import './RightMenu.css';
import ClassificationFilter from "../components/ClassificationFilter/ClassificationFilter";
// import MassFilter from '../components/MassFilter/MassFilter';
// import YearFilter from '../components/YearFilter/YearFilter';

export default function RightMenu() {

    return (
        <div className="RightMenu">
            {/* <YearFilter /> */}
            {/* <MassFilter /> */}
            <ClassificationFilter />
        </div>
    )
}