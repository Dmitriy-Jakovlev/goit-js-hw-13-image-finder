const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
const apiKey = '20675253-cdd8f56cc704bd20aa8c935fc';



export default {
    searchQuery: '',
    page: 1,
    fetchPictures() {
        const url = `${BASE_URL}&q=${this.query}&page=${this.page}&per_page=12&key=${apiKey}`
        return fetch(url)
            .then(res => res.json())
            .then(({ hits }) => {
            this.page += 1;
            return hits;
        })
            .catch(error => console.log(error))
    },
   resetPage() {
        this.page = 1;
    },
   get query() {
        return this.searchQuery
    },
   set query(value) {
        this.searchQuery = value;
    },
};