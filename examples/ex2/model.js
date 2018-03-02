var PlayerList = [];
PlayerList.push({name: "Tim", age: 22, position: "center"});
PlayerList.push({name: "Bob", age: 52, position: "top"});
PlayerList.push({name: "Kim", age: 41, position: "front"});

var Billing = {};
Billing.playerCount = function(){
    return PlayerList.length;
};
Billing.calculate = function(){
    return Billing.playerCount() * parseInt(Billing.cost_per) + parseInt(Billing.overhead);
}
Billing.cost_per = 10;
Billing.overhead = 200;
