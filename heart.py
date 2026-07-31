import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Configure the grid coordinate space
grid_resolution = 500
x = np.linspace(-1.5, 1.5, grid_resolution)
y = np.linspace(-1.5, 1.5, grid_resolution)
X, Y = np.meshgrid(x, y)

# Evaluate the algebraic heart equation
# Points inside the heart result in a value less than or equal to 0
heart_equation = (X**2 + Y**2 - 1)**3 - X**2 * Y**3
inside_heart_mask = heart_equation <= 0

# Set up the visualization figure with a clean black background
fig, ax = plt.subplots(figsize=(6, 6), facecolor='black')
ax.set_xlim(-1.5, 1.5)
ax.set_ylim(-1.5, 1.5)
ax.set_aspect('equal')
ax.axis('off')

# Draw the neon-style outer boundary of the heart
ax.contour(X, Y, heart_equation, levels=[0], colors='#ff2a6d', linewidths=2.5)

# Initialize a blank RGBA array for the filling fluid
fluid_color = np.zeros((grid_resolution, grid_resolution, 4))
fluid_color[:, :, 0] = 1.0   # Red channel
fluid_color[:, :, 1] = 0.18  # Green channel
fluid_color[:, :, 2] = 0.45  # Blue channel
fluid_color[:, :, 3] = 0.0   # Alpha (transparency) channel starts empty

# Create an image placeholder to update dynamically during animation
image_display = ax.imshow(fluid_color, extent=[-1.5, 1.5, -1.5, 1.5], origin='lower')

def update_fill(current_height):
    """Updates the transparency mask to simulate rising liquid."""
    # Active fill area must be inside the heart boundary and below the current height line
    active_fill_area = inside_heart_mask & (Y <= current_height)
    
    # Update the alpha channel transparency based on the active fill area
    updated_fluid = fluid_color.copy()
    updated_fluid[:, :, 3] = active_fill_area.astype(float) * 0.9
    
    image_display.set_data(updated_fluid)
    return [image_display]

# Define rising animation sequence from the lowest point to the highest point
fill_stages = np.linspace(-1.1, 1.3, 120)

# Build the final animation loop
heart_animation = animation.FuncAnimation(
    fig, 
    update_fill, 
    frames=fill_stages, 
    interval=20, 
    blit=True,
    repeat=True
)

plt.show()
