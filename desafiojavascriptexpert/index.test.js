import assert from 'assert';
import Product from './product.js';
import Service from './service.js';


const callTracker = new assert.CallTracker();

//When the process over valid all calls
process.on('exit', () => callTracker.verify());

//should throw an error when description is less than 5 characters long
{
    const params = {
        id: 1,
        description: 'My p',
        price: 1000,
    }

    const product = new Product({
        onCreate: () => {},
        service: new Service()
    });

    assert.rejects(
        () => product.create(params),
        { message: 'description must be higher than 5'},
        'it should thrown an error with wrong description'
    )

}

//should save product successfully

{
    //Mock we need it to the test work porpely
    const params = {
        id: 1,
        description: 'My product',
        price: 1000,
    }

    //servirceStub = prevent online connection
    const spySave = callTracker.calls(1)
    const servirceStub ={
        async save(params) {
            spySave(params)
            return `${params.id} saved with sucess!`;
        }
    }

    const fn = (msg) => {
        assert.deepStrictEqual(msg.id, params.id, 'id should be the same');
        assert.deepStrictEqual(msg.price, params.price, 'price should be the same');
        assert.deepStrictEqual(msg.description, params.description.toLocaleUpperCase(), 'description should be the same');
    }

    const spyOnCreate = callTracker.calls(fn, 1);

    const product = new Product({
        onCreate: spyOnCreate,
        service: servirceStub
    });

    const result = await product.create(params);
    assert.strictEqual(result, `${params.id} SAVED WITH SUCESS!`);
}