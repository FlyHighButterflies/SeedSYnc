from math import radians, sin, cos, sqrt, atan2
import heapq

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)

    a = sin(d_lat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c  # Distance in km

def heuristic(a_coords, b_coords):
    return haversine_distance(*a_coords, *b_coords)

def a_star(graph, start, goal, coords):
    queue = []
    heapq.heappush(queue, (0, start))
    came_from = {start: None}
    cost_so_far = {start: 0}

    while queue:
        _, current = heapq.heappop(queue)

        if current == goal:
            break

        for neighbor in graph.get(current, []):
            neighbor_node = neighbor[0]
            # Use haversine distance as the cost if not explicitly provided
            cost = neighbor[1] if len(neighbor) > 1 else haversine_distance(
                *coords[current], *coords[neighbor_node]
            )

            new_cost = cost_so_far[current] + cost
            if neighbor_node not in cost_so_far or new_cost < cost_so_far[neighbor_node]:
                cost_so_far[neighbor_node] = new_cost
                priority = new_cost + heuristic(coords[neighbor_node], coords[goal])
                heapq.heappush(queue, (priority, neighbor_node))
                came_from[neighbor_node] = current

    return reconstruct_path(came_from, start, goal)

def reconstruct_path(came_from, start, goal):
    if goal not in came_from:
        return []  # No path
    path = []
    current = goal
    while current != start:
        path.append(current)
        current = came_from[current]
    path.append(start)
    path.reverse()
    return path