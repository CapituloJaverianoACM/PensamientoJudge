#include <iostream>

using namespace std;


void imprimir( char triqui[ 3 ][ 3 ] )
{
  cout <<"--- " << endl;
  for( int i = 0 ; i < 3 ; i++ )
  {
    for( int j = 0 ; j < 3 ; ++j )
    {
      cout << triqui[i][j];
    }
    cout << endl;
  }
  cout <<"--- " << endl;
}

bool jugada( int fila , int columna , char triqui[ 3 ][ 3 ] , char caracter )
{
  if( fila < 0 || fila >= 3 || columna < 0 || columna >= 3 )
    return false;
  if( triqui[ fila ][ columna ] ==  ' ' )
  {
    triqui[ fila ][ columna ] = caracter;
    return true;
  }
  else
  {
    return false;
  }
}

bool empate(  char triqui[ 3 ][ 3 ]  )
{
  for( int i = 0 ; i < 3 ; i++ )
  {
    for( int j = 0 ; j < 3 ; j++ )
    {
      if( triqui[i][j] == ' ' )
      {
        return false;
      }
    }
  }
  return true;
}

char ganador( char triqui[ 3 ][ 3 ] )
{
  for( int i = 0 ; i < 3 ; i++ )
  {
    if( triqui[ i ][ 0 ] == triqui[ i ][ 1 ] && triqui[ i ][ 1 ] == triqui[ i ][ 2 ]  && triqui[ i ][ 0 ] != ' ' )
    {
      return triqui[ i ][ 0 ] ;
    }
  }
  for( int i = 0 ; i < 3 ; i++ )
  {
    if( triqui[ 0 ][ i ] == triqui[ 1 ][ i ] && triqui[ 1 ][ i ] == triqui[ 2 ][ i ]  && triqui[ 0 ][ i ] != ' ' )
    {
      return triqui[ 0 ][ i ] ;
    }
  }
  if( triqui[ 0 ][ 0 ] == triqui[ 1 ][ 1 ] && triqui[ 1 ][ 1 ] == triqui[ 2 ][ 2 ]  && triqui[ 0 ][ 0 ] != ' ' )
  {
    return triqui[ 0 ][ 0 ];
  }
  if( triqui[ 0 ][ 2 ] == triqui[ 1 ][ 1 ] && triqui[ 1 ][ 1 ] == triqui[ 2 ][ 0 ]  && triqui[ 2 ][ 0 ] != ' ' )
  {
    return triqui[ 2 ][ 0 ];
  }
  return ' ';
}

int verficar( char triqui[ 3 ][ 3 ] )
{
  char quienGano = ganador(triqui);
  if(  quienGano == 'X' )
  {
    return 1;
  }
  else if( quienGano == 'O' )
  {
    return 2;
  }
  else if( empate(triqui) )
  {
    return 3;
  }
  return 0;
}


int main()
{
  char triqui[ 3 ][ 3 ];
  int  termino = 0; // 0 - no ha terminado , 1 - gano el jugador 1 , 2 - gano el jugador 2 , 3 - empate
  int turno = 0 ;
  int fila,columna;
  for( int i = 0 ; i < 3 ; i++ )
  {
    for( int j = 0 ; j < 3 ; j++ )
    {
      triqui[ i ][ j ] = ' ';
    }
  }
  while( termino == 0 )
  {
    imprimir( triqui );
    if( turno % 2 == 0 )
    {
      cout << "Inserte la jugada del jugador 1 " << endl;
      cout << "Inserte la fila " << endl;
      cin >> fila;
      cout << "Inserte la columna " << endl;
      cin >> columna;
      if( jugada( fila , columna , triqui , 'X') ==  false )
      {
        cout << "Error en la jugada " << endl ;
        turno--;
      }
    }
    else
    {
      cout << "Inserte la jugada del jugador 2 " << endl;
      cout << "Inserte la fila " << endl;
      cin >> fila;
      cout << "Inserte la columna " << endl;
      cin >> columna;
      if( jugada( fila , columna , triqui , 'O' )  == false )
      {
        cout << "Error en la jugada " << endl ;
        turno--;
      }
    }
    turno++;
    termino = verficar( triqui );
  }
  if( termino == 1 )
  {
    cout << "El jugador 1 gano !!!!!!"<<endl;
  }
  else if( termino == 2 )
  {
    cout << "El jugador 2 gano !!!!!!"<<endl;
  }
  else if( termino == 3 )
  {
    cout << "Empate"<<endl;
  }
  return 0;
}
