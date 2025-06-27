import heapq

def heuristic(a, b):
    # Replace with actual geographic distance later (Haversine, etc.)
    return abs(ord(a[-1]) - ord(b[-1]))  # Dummy heuristic based on Region letter

def a_star(graph, start, goal):
    queue = []
    heapq.heappush(queue, (0, start))
    came_from = {start: None}
    cost_so_far = {start: 0}

    while queue:
        _, current = heapq.heappop(queue)

        if current == goal:
            break

        for neighbor, cost in graph.get(current, []):
            new_cost = cost_so_far[current] + cost
            if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                cost_so_far[neighbor] = new_cost
                priority = new_cost + heuristic(neighbor, goal)
                heapq.heappush(queue, (priority, neighbor))
                came_from[neighbor] = current

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