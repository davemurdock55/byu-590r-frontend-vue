
export default {
    name: 'HomeView',
    data: function ()
    {
        return {
            listOfBooks: [
            ],
            mySpecialInput: ''
        }
    },
    created()
    {
        console.log('CREATED => This is my special input', this.mySpecialInput);
    }
}