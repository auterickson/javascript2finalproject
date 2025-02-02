import {
    Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement, ArcElement
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
);

ChartJS.defaults.font.family = "'Shantell Sans', sans-serif";
ChartJS.defaults.plugins.legend.labels.font = {...ChartJS.defaults.font};
ChartJS.defaults.plugins.legend.labels.font.weight = 'bold';
ChartJS.defaults.scale.title.font = {...ChartJS.defaults.font};
ChartJS.defaults.scale.title.font.weight = 'bold';

export default ChartJS;