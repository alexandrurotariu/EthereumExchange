pragma solidity >=0.4.20;

// Contratto che realizza il nostro Token
contract Token {

    //nome token
    string public name = "RomaTre Token";
    //simbolo token
    string public symbol = "RM3";
    //definizione dallo standard
    uint256 public totalSupply = 1000000000000000000000000; // 1 milione di token
    uint8 public decimals = 18;
    //mappa indirizzi -> saldo token 
    mapping(address => uint256) public balanceOf;
    //mappa indirizzi -> indirizzi autorizzati a spendere -> quantita' token
    // <indirizzo utente, <indirizzo exchange,token> >
    mapping(address => mapping(address => uint256)) public allowance;

    

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    //costruttore 
    constructor() public {
        //msg.sender inidrizzo chi effettua il deploy del contratto
        //assegnazione dei token ad un indirizzo
        balanceOf[msg.sender] = totalSupply;
    }

    //trasferimento di token (return un boolano)
    //eccezione se l'account non ha saldo sufficiente
    function transfer(address _to, uint256 _value) public returns (bool success){
        //require -> se la condizione è vera continua l'esecuzione, altrimenti errore
        require(balanceOf[msg.sender] >= _value);
        //trasferiento della somma
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        //transfer event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //approvazione per il trasferimento da parte di un account spender (utente)
    function approve(address _spender, uint256 _value) public returns (bool success){
        // approviamo _spender(exchange) a spendere _value token posseduti da msg.sender(utente)
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }


    //trasferimento da una sorgente
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        //from deve avere token sufficienti
        require(balanceOf[_from] >= _value);
        //la quantità approvata deve essere >= di quella trasferita
        require(allowance[_from][msg.sender] >= _value);
        //trasferiento della somma
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }



    //funzione getter creata di default dallo standard
    //funzione balanceOf creata di default dallo standard
    
}