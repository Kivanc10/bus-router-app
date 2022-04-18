import stations from "./stationsInfo.json"

// Javascript program to find the shortest
// path between any two nodes using
// Floyd Warshall Algorithm.
//window.alert(Object.keys(stations).length)
let MAXN = Object.keys(stations).length;

// Infinite value for array
let INF = 999;
let dis = new Array(MAXN);
let Next = new Array(MAXN);
for(let i = 0; i < MAXN; i++)
{
	dis[i] = new Array(MAXN);
	Next[i] = new Array(MAXN);
}

// Initializing the distance and
// Next array
function initialise(V, graph)
{
	for(let i = 0; i < V; i++)
	{
		for(let j = 0; j < V; j++)
		{
			dis[i][j] = graph[i][j];
				
			// No edge between node
			// i and j
			if (graph[i][j] == INF)
				Next[i][j] = -1;
			else
				Next[i][j] = j;
		}
	}
}

// Function construct the shortest
// path between u and v
function constructPath(u, v)
{
	
	// If there's no path between
	// node u and v, simply return
	// an empty array
	if (Next[u][v] == -1)
		return null;

	// Storing the path in a vector
	let path = [];
	path.push(u);
	
	while (u != v)
	{
		u = Next[u][v];
		path.push(u);
	}
	return path;
}

// Standard Floyd Warshall Algorithm
// with little modification Now if we find
// that dis[i][j] > dis[i][k] + dis[k][j]
// then we modify next[i][j] = next[i][k]
function floydWarshall(V)
{
	for(let k = 0; k < V; k++)
	{
		for(let i = 0; i < V; i++)
		{
			for(let j = 0; j < V; j++)
			{
				
				// We cannot travel through
				// edge that doesn't exist
				if (dis[i][k] == INF ||
					dis[k][j] == INF)
					continue;
					
				if (dis[i][j] > dis[i][k] +
								dis[k][j])
				{
					dis[i][j] = dis[i][k] +
								dis[k][j];
					Next[i][j] = Next[i][k];
				}
			}
		}
	}
}

function printPath(path)
{
	let n = path.length;
	for(let i = 0; i < n - 1; i++)
		console.log(path[i]);
		
	console.log(path[n - 1] );
}

// Driver code

let graph = [ [ 0, 3, INF, 7 ],
			[ 8, 0, 2, INF ],
			[ 5, INF, 0, 1 ],
			[ 2, INF, INF, 0 ] ];

let V = graph.length;

export function findShortestPaths(graph,start_i,end_i){
    let V = graph.length;
    initialise(V, graph);
    floydWarshall(V);
    let path = constructPath(start_i, end_i);
    return {
        path,
        dis
    }
}

//window.alert(findShortestPaths(graph,3,2))
/*
// Function to initialise the
// distance and Next array
initialise(V, graph);

// Calling Floyd Warshall Algorithm,
// this will update the shortest
// distance as well as Next array
floydWarshall(V);
let path;

// Path from node 1 to 3
console.log("Shortest path from 1 to 3: ");
path = constructPath(1, 3);
//printPath(path);
console.log(path)


// Path from node 0 to 2
console.log("Shortest path from 0 to 2: ");
path = constructPath(0, 2);
//printPath(path);
console.log(path)


// Path from node 3 to 2
console.log("Shortest path from 3 to 2: ");
path = constructPath(3, 2);
console.log(path)
// printPath(path);
*/
// This code is contributed by unknown2108


